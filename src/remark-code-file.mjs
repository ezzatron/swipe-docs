import { open } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { visit } from "unist-util-visit";

const FILE_PATTERN = /file="([^"]*)"/;
const LINES_PATTERN = /^L([1-9]\d*)(-)?(?:L([1-9]\d*))?$/;
const TITLE_PATTERN = /title="[^"]*"/;
const SHOW_LINE_NUMBERS_PATTERN = /showLineNumbers(?:{([1-9]\d*)})?/;
const INDENT_PATTERN = /^[ \t]*(?=\S)/gm;

const DEFAULT_META_TRANSFORMS = [
  addShowLineNumbersMetaTransform,
  addTitleMetaTransform,
];

export default function remarkCodeFile(options = {}) {
  return async (tree, vfile) => {
    const tasks = [];

    visit(tree, "code", (node) => {
      tasks.push(processCode(options, vfile, node));
    });

    await Promise.all(tasks);
  };
}

export function addShowLineNumbersMetaTransform(meta, { options, startLine }) {
  const showLineNumbers =
    startLine === 1 ? "showLineNumbers" : `showLineNumbers{${startLine}}`;
  const matches = SHOW_LINE_NUMBERS_PATTERN.exec(meta);

  // has showLineNumbers already
  if (matches) {
    // has start line number already
    if (matches[1]) return meta;

    // add start line number
    return meta.replace(SHOW_LINE_NUMBERS_PATTERN, showLineNumbers);
  }

  // add showLineNumbers with start line number unless disabled
  return options.showLineNumbers ? `${meta} ${showLineNumbers}` : meta;
}

export function addTitleMetaTransform(meta, { fileContext, filePath }) {
  return TITLE_PATTERN.test(meta)
    ? meta
    : fileContext === "/"
      ? `${meta} title="${filePath}"`
      : `${meta} title="${relative(fileContext, filePath)}"`;
}

async function processCode(pluginOptions, vfile, node) {
  const params = parseFileSpecToParams(pluginOptions, vfile, node);

  if (!params) return;

  const { documentPath, filePath, startLine, endLine, options } = params;

  try {
    const fileContent = await readFileLines(filePath, startLine, endLine);
    node.value = options.stripIndent ? stripIndent(fileContent) : fileContent;

    transformMeta(node, params, options.metaTransforms);
  } catch (error) {
    if (error instanceof Error && error?.code !== "ENOENT") throw error;

    const filePosition = buildFilePosition(filePath, startLine);
    const { line, column } = node.position.start;
    const documentPosition = buildFilePosition(documentPath, line, column);

    throw new Error(
      `Code file ${filePosition} referenced in ${documentPosition} not found.`,
    );
  }
}

function parseFileSpecToParams(pluginOptions, vfile, node) {
  const [fileSpec, possibleFilePath, fileOptions, startLine, endLine] =
    parseFileSpec(pluginOptions, vfile, node);

  if (!fileSpec) return;

  const documentPath = vfile.path;
  const documentDir = vfile.dirname;
  const options = resolveOptions(pluginOptions, fileOptions);
  const { rootPath } = options;
  const filePath = restrictPath("Code file", rootPath, possibleFilePath);
  const fileContext = restrictPath(
    "Code file context",
    rootPath,
    options.context ? resolve(documentDir, options.context) : dirname(filePath),
  );

  return {
    documentPath,
    documentDir,
    fileContext,
    fileSpec,
    filePath,
    startLine,
    endLine,
    options,
  };
}

function restrictPath(type, rootPath, filePath) {
  const relativePath = relative(rootPath, filePath);
  const isInside =
    relativePath &&
    !relativePath.startsWith("..") &&
    !relativePath.startsWith("/");

  if (isInside) return filePath;

  throw new Error(
    `${type} ${filePath} is not allowed because is outside of the root path.`,
  );
}

function resolveOptions(pluginOptions, fileOptions) {
  const normalizedPluginOptions = { ...pluginOptions };
  if (pluginOptions.context) {
    normalizedPluginOptions.context = resolve(pluginOptions.context);
  }

  return Object.assign(
    {
      metaTransforms: DEFAULT_META_TRANSFORMS,
      rootPath: ".",
      showLineNumbers: true,
      stripIndent: true,
    },
    normalizedPluginOptions,
    fileOptions,
  );
}

function parseFileOptions(searchParams) {
  const options = {};

  for (const option of ["context"]) {
    if (searchParams.has(option)) options[option] = searchParams.get(option);
  }

  if (searchParams.has("line-numbers")) options.showLineNumbers = true;
  if (searchParams.has("no-line-numbers")) options.showLineNumbers = false;
  if (searchParams.has("strip-indent")) options.stripIndent = true;
  if (searchParams.has("no-strip-indent")) options.stripIndent = false;

  return options;
}

function parseFileSpec(pluginOptions, vfile, node) {
  const options = resolveOptions(pluginOptions, {});
  const fileMatches = FILE_PATTERN.exec(node.meta);
  const fileSpec = fileMatches?.[1] ?? "";

  if (!fileSpec) return [undefined, "", undefined, 1, Infinity];

  node.meta = node.meta.replace(FILE_PATTERN, "").trim();

  const basePath = fileSpec.startsWith("./")
    ? vfile.dirname + "/"
    : resolve(options.rootPath) + "/";

  const fileURL = new URL(fileSpec, pathToFileURL(basePath));
  const fileOptions = parseFileOptions(fileURL.searchParams);
  const filePath = fileURLToPath(fileURL);
  const linesMatches = LINES_PATTERN.exec(decodedURLHash(fileURL));

  if (!linesMatches) return [fileSpec, filePath, fileOptions, 1, Infinity];

  const startLine = parseInt(linesMatches[1], 10);
  const endLine = linesMatches[3]
    ? parseInt(linesMatches[3], 10)
    : linesMatches[2]
      ? Infinity
      : startLine;

  return [fileSpec, filePath, fileOptions, startLine, endLine];
}

function decodedURLHash(url) {
  return url.hash ? decodeURIComponent(url.hash.replace(/^#/, "")) : "";
}

function transformMeta(node, params, transforms) {
  node.meta = transforms.reduce(
    (meta, transform) => transform(meta, params),
    node.meta,
  );
}

async function readFileLines(filePath, startLine, endLine) {
  const fileHandle = await open(filePath, "r");

  try {
    let lineNumber = 0;
    let fileContent = "";

    for await (const line of fileHandle.readLines({ encoding: "utf8" })) {
      ++lineNumber;
      if (lineNumber < startLine) continue;
      if (lineNumber > endLine) break;
      fileContent += line + "\n";
    }

    return fileContent.replace(/\n$/, "");
  } finally {
    await fileHandle.close();
  }
}

function stripIndent(fileContent) {
  const matches = INDENT_PATTERN.exec(fileContent);
  const indent = matches
    ? matches.reduce((r, a) => Math.min(r, a.length), Infinity)
    : 0;

  if (indent === 0) return fileContent;

  return fileContent.replace(new RegExp(`^[ \\t]{${indent}}`, "gm"), "");
}

function buildFilePosition(filePath, line, column = 1) {
  const relativePath = relative(process.cwd(), filePath);

  return column === 1
    ? `${relativePath}:${line}`
    : `${relativePath}:${line}:${column}`;
}
