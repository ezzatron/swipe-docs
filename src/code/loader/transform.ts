import type { Element, ElementContent, Root, Text } from "hast";
import { visit } from "unist-util-visit";
import {
  CODE_BLOCK_CLASS,
  LINE_CLASS,
  LINE_NUMBER_CLASS,
  LINE_NUMBERS_CLASS,
  SECTION_CONTENT_CLASS,
  SPACE_CLASS,
  TAB_CLASS,
} from "./class.js";

/**
 * Matches comments.
 *
 * The pattern is:
 * - (\s*(?:\/\/|\/\*|<!--|#|--|%%?|;;?|"|')) - comment start
 * - \s+ - whitespace
 * - (.*?) - comment content (non-greedy)
 * - \s* - optional whitespace
 * - ((?:\*\/|-->)\s*)? - optional comment end
 */
const COMMENT_PATTERN =
  /^(\s*(?:\/\/|\/\*|<!--|#|--|%%?|;;?|"|')\s+)(.*?)\s*((?:\*\/|-->)\s*)?$/;

/**
 * Matches annotations.
 *
 * The pattern is:
 * - \s? - optional whitespace
 * - \[! - annotation start
 * - ([\w-]+) - annotation name
 * - (?:\s+(.+?))? - optional annotation value
 * - ] - annotation end
 * - \s? - optional whitespace
 */
const ANNOTATION_PATTERN = /\s?\[!([\w-]+)(?:\s+(.+?))?]\s?/g;

/**
 * Splits on whitespace and retains the delimiters.
 *
 * The pattern is:
 * - (?=[ \t]) - positive lookahead for space or tab
 * - | - or
 * - (?<=[ \t]) - positive lookbehind for space or tab
 */
const WHITESPACE_PATTERN = /(?=[ \t])|(?<=[ \t])/g;

const WHITESPACE_CLASS_MAP: Record<string, string> = {
  " ": SPACE_CLASS,
  "\t": TAB_CLASS,
};

const SECTION_DATA = "data-s";

export function transform(tree: Root): Root {
  const lines: Element[] = splitLines(tree);
  const [annotations, annotationComments] = parseAnnotations(lines);

  addSections(lines, annotations);
  cleanupLines(lines, annotationComments);
  trimSectionLines(lines);
  trimSectionLines(lines.toReversed());
  wrapWhitespace(lines);

  const pre: Element = {
    type: "element",
    tagName: "pre",
    properties: { class: CODE_BLOCK_CLASS },
    children: [
      {
        type: "element",
        tagName: "div",
        properties: { class: SECTION_CONTENT_CLASS },
        children: [
          createLineNumbers(1, lines.length, lines.length),
          {
            type: "element",
            tagName: "code",
            properties: {},
            children: lines,
          },
        ],
      },
    ],
  };

  return { type: "root", children: [pre] };
}

function splitLines(tree: Root): Element[] {
  const lines: Element[] = [];
  let line: Element = emptyLine();

  for (let i = 0; i < tree.children.length; ++i) {
    const node = tree.children[i];

    // newlines are only in text nodes
    if (node.type === "element") {
      line.children.push(node);
      continue;
    }
    if (node.type !== "text") {
      tree.children.push(node);
      continue;
    }

    const parts = node.value.split("\n");

    if (parts.length < 2) {
      line.children.push(node);
    } else {
      for (let j = 0; j < parts.length; ++j) {
        if (j > 0) {
          lines.push(line);
          line = emptyLine();
        }

        line.children.push({ type: "text", value: parts[j] });
      }
    }
  }

  return lines;
}

type Annotation = {
  source: string;
  name: string;
  value: string;
};

type AnnotationComment = [start: string, content: string, end: string];

function parseAnnotations(
  lines: Element[],
): [
  annotations: Record<number, Annotation[]>,
  comments: Map<Text, AnnotationComment>,
] {
  const annotations: Record<number, Annotation[]> = {};
  const comments: Map<Text, [start: string, content: string, end: string]> =
    new Map();

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    annotations[i] = [];

    for (let j = 0; j < line.children.length; ++j) {
      const node = line.children[j];
      if (node.type !== "element" || node.children.length !== 1) continue;
      const [text] = node.children;
      if (text?.type !== "text") continue;
      const commentMatch = text.value.match(COMMENT_PATTERN);
      if (!commentMatch) continue;
      const annotationMatches = commentMatch[2].matchAll(ANNOTATION_PATTERN);
      if (!annotationMatches) continue;

      comments.set(text, commentMatch.slice(1) as [string, string, string]);

      for (const [source, name, value] of annotationMatches) {
        annotations[i].push({ source, name, value });
      }
    }
  }

  return [annotations, comments];
}

function addSections(
  lines: Element[],
  annotations: Record<number, Annotation[]>,
): void {
  const seenSections = new Map<string, number>();
  const openSections = new Map<string, number>();

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    if (line.type !== "element") continue;
    const lineNumber = i + 1;
    const sections = new Map(openSections);

    for (const { source, name, value } of annotations[i]) {
      const isSingleLine = name === "section";
      const isStart = name === "section-start";
      const isEnd = name === "section-end";

      if (!isSingleLine && !isStart && !isEnd) continue;
      if (!value) {
        throw new Error(
          `Missing code section name on line ${lineNumber} ` +
            `in annotation ${source}`,
        );
      }
      if (!isEnd && seenSections.has(value)) {
        const seenLineNumber = seenSections.get(value);

        throw new Error(
          `Code section ${value} on line ${lineNumber} ` +
            `already seen on line ${seenLineNumber}`,
        );
      }

      seenSections.set(value, lineNumber);
      sections.set(value, lineNumber);
      if (isStart) openSections.set(value, lineNumber);
      if (isEnd) openSections.delete(value);
    }

    if (sections.size < 1) continue;

    line.properties[SECTION_DATA] = Array.from(sections.keys())
      .sort((a, b) => a.localeCompare(b))
      .join(" ");
  }

  if (openSections.size > 0) {
    const descriptions = Array.from(openSections)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, lineNumber]) => `${name} on line ${lineNumber}`);

    throw new Error(`Unclosed code sections: ${descriptions.join(", ")}`);
  }
}

function cleanupLines(
  lines: Element[],
  annotationComments: Map<Text, AnnotationComment>,
): void {
  let isFollowingEmpty = false;

  for (let i = lines.length - 1; i >= 0; --i) {
    // strip annotations
    const line = lines[i];
    let wasCommentRemoved = false;

    for (let j = line.children.length - 1; j >= 0; --j) {
      const node = line.children[j];
      if (node.type !== "element") continue;
      const [text] = node.children;
      if (text?.type !== "text") continue;
      const comment = annotationComments.get(text);
      if (!comment) continue;

      const [start, , end = ""] = comment;
      const content = comment[1].replaceAll(ANNOTATION_PATTERN, " ").trim();

      if (content) {
        // comment still has content after stripping annotations
        text.value = `${start}${content}${end}`;
      } else {
        wasCommentRemoved = true;

        const prevSibling = line.children[j - 1];
        const prevText =
          prevSibling?.type === "element" ? prevSibling.children[0] : undefined;
        const nextSibling = line.children[j + 1];
        const nextText =
          nextSibling?.type === "element" ? nextSibling.children[0] : undefined;
        const isJSX =
          prevText?.type === "text" &&
          prevText.value === "{" &&
          nextText?.type === "text" &&
          nextText.value === "}";

        if (isJSX) {
          line.children.splice(j - 1, 3);
          j -= 2; // account for the two additional elements that were removed
        } else {
          line.children.splice(j, 1);
        }
      }
    }

    if (wasCommentRemoved && isEmptyLine(line)) {
      lines.splice(i, 1);
      continue;
    }

    // strip trailing whitespace
    for (let j = line.children.length - 1; j >= 0; --j) {
      const node = line.children[j];
      if (node.type !== "text") break;

      const trimmed = node.value.trimEnd();

      if (!trimmed) {
        line.children.splice(j, 1);
        continue;
      }

      if (trimmed !== node.value) {
        node.value = trimmed;
        break;
      }
    }

    // trim/collapse empty lines
    const isEmpty = isEmptyLine(line);

    if (isEmpty && (isFollowingEmpty || i === 0 || i === lines.length - 1)) {
      lines.splice(i, 1);
    }

    isFollowingEmpty = isEmpty;
  }

  // strip leading empty line
  if (lines[0] && isEmptyLine(lines[0])) lines.shift();

  // ensure all remaining lines end with a newline
  for (let i = lines.length - 1; i >= 0; --i) {
    lines[i].children.push({ type: "text", value: "\n" });
  }
}

function trimSectionLines(lines: Element[]): void {
  const seenSections = new Set<string>();

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    if (typeof line.properties[SECTION_DATA] !== "string") continue;

    const lineSections = new Set(line.properties[SECTION_DATA].split(" "));
    const isEmpty = isEmptyLine(line);

    for (const section of lineSections) {
      if (isEmpty && !seenSections.has(section)) {
        lineSections.delete(section);

        continue;
      }

      seenSections.add(section);
    }

    if (lineSections.size < 1) {
      delete line.properties[SECTION_DATA];
    } else {
      line.properties[SECTION_DATA] = Array.from(lineSections).join(" ");
    }
  }
}

function wrapWhitespace(lines: Element[]): void {
  visit(
    { type: "root", children: lines },
    "text",
    (node, index, parent) => {
      if (!parent || index == null) return;

      const parts = node.value.split(WHITESPACE_PATTERN);
      const replacement: ElementContent[] = [];

      for (const part of parts) {
        const partText: Text = { type: "text", value: part };
        const className = WHITESPACE_CLASS_MAP[part];

        replacement.push(
          className
            ? {
                type: "element",
                tagName: "span",
                properties: { class: className },
                children: [partText],
              }
            : partText,
        );
      }

      parent.children.splice(index, 1, ...replacement);
    },
    true,
  );
}

function createLineNumbers(
  start: number,
  count: number,
  totalLines: number,
): Element {
  const width = `${String(totalLines).length}ch`;
  const numbers: Element = {
    type: "element",
    tagName: "div",
    properties: { class: LINE_NUMBERS_CLASS, style: `--cb-w: ${width}` },
    children: [],
  };

  for (let i = 0; i < count; ++i) {
    numbers.children.push({
      type: "element",
      tagName: "div",
      properties: { class: LINE_NUMBER_CLASS },
      children: [{ type: "text", value: String(start + i) }],
    });
  }

  return numbers;
}

function emptyLine(): Element {
  return {
    type: "element",
    tagName: "div",
    properties: { class: LINE_CLASS },
    children: [],
  };
}

function isEmptyLine(line: Element): boolean {
  for (const node of line.children) {
    if (node.type !== "text" || node.value.trim()) return false;
  }

  return true;
}
