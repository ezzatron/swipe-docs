import type { Element, Root } from "hast";
import createClassList from "hast-util-class-list";
import { cssClass, dataAttribute } from "impasto";
import {
  LINE_NUMBERS_SHOW_CLASS,
  SECTION_CONTENT_CLASS,
  SECTION_CONTENT_INDENT_CLASS,
  SECTION_CONTEXT_CLASS,
} from "./class";

type Options = {
  showLineNumbers?: boolean;
  section?: string;
  noSectionContext?: boolean;
};

export function transform(
  tree: Root,
  { showLineNumbers = false, section, noSectionContext = false }: Options = {},
): Root {
  tree = structuredClone(tree);

  const [pre] = tree.children;
  if (pre?.type !== "element") throw new Error("Unexpected tree");
  const preClassList = createClassList(pre);
  if (!preClassList.contains(cssClass.codeBlock)) {
    throw new Error("Unexpected tree");
  }

  if (showLineNumbers) preClassList.add(LINE_NUMBERS_SHOW_CLASS);

  if (!section) return tree;

  const [lineNumberContainer, code] = pre.children;
  if (
    lineNumberContainer?.type !== "element" ||
    !createClassList(lineNumberContainer).contains(cssClass.lineNumbers) ||
    code?.type !== "element" ||
    code.tagName !== "code"
  ) {
    throw new Error("Unexpected tree");
  }

  const lineNumbers: Element[] = [];
  for (const child of lineNumberContainer.children) {
    if (child.type === "element") lineNumbers.push(child);
  }

  const lines: Element[] = [];
  for (const child of code.children) {
    if (child.type === "element") lines.push(child);
  }

  const [
    sectionLineNumbers,
    sectionLines,
    lineNumbersBefore,
    linesBefore,
    lineNumbersAfter,
    linesAfter,
  ] = splitSection(lineNumbers, lines, section);
  const hasContext = lineNumbersBefore.length + lineNumbersAfter.length > 0;

  if (!hasContext) return tree;

  if (!noSectionContext) pre.properties[dataAttribute.sectionName] = section;

  for (const lineNumber of sectionLineNumbers) {
    const lineNumberClassList = createClassList(lineNumber);
    lineNumberClassList.add(SECTION_CONTENT_CLASS);
  }
  for (const line of sectionLines) {
    const lineClassList = createClassList(line);
    lineClassList.add(SECTION_CONTENT_CLASS);
  }

  const indentWidth = wrapSectionIndent(sectionLines);

  if (noSectionContext) {
    lineNumberContainer.children = sectionLineNumbers;
    code.children = sectionLines;
  } else {
    pre.properties.style = `--imp-iw: ${indentWidth}ch`;

    for (const lineNumber of lineNumbersBefore) {
      const lineNumberClassList = createClassList(lineNumber);
      lineNumberClassList.add(SECTION_CONTEXT_CLASS);
    }
    for (const line of linesBefore) {
      const lineClassList = createClassList(line);
      lineClassList.add(SECTION_CONTEXT_CLASS);
    }

    for (const lineNumber of lineNumbersAfter) {
      const lineNumberClassList = createClassList(lineNumber);
      lineNumberClassList.add(SECTION_CONTEXT_CLASS);
    }
    for (const line of linesAfter) {
      const lineClassList = createClassList(line);
      lineClassList.add(SECTION_CONTEXT_CLASS);
    }
  }

  return tree;
}

function splitSection(
  lineNumbers: Element[],
  lines: Element[],
  name: string | undefined,
): [
  sectionLineNumbers: Element[],
  sectionLines: Element[],
  lineNumbersBefore: Element[],
  linesBefore: Element[],
  lineNumbersAfter: Element[],
  linesAfter: Element[],
] {
  if (!name) return [lineNumbers, lines, [], [], [], []];

  const sectionLineNumbers: Element[] = [];
  const sectionLines: Element[] = [];
  const lineNumbersBefore: Element[] = [];
  const linesBefore: Element[] = [];
  const lineNumbersAfter: Element[] = [];
  const linesAfter: Element[] = [];
  let hasSection = false;

  for (let i = 0; i < lines.length; ++i) {
    const lineNumber = lineNumbers[i];
    const line = lines[i];

    const sectionsData = line.properties[dataAttribute.sectionName];
    const sections =
      typeof sectionsData === "string" ? sectionsData.split(" ") : [];

    if (sections.includes(name)) {
      hasSection = true;
      sectionLineNumbers.push(lineNumber);
      sectionLines.push(line);
    } else if (hasSection) {
      lineNumbersAfter.push(lineNumber);
      linesAfter.push(line);
    } else {
      lineNumbersBefore.push(lineNumber);
      linesBefore.push(line);
    }
  }

  if (!hasSection) throw new Error(`Missing code section ${name}`);

  return [
    sectionLineNumbers,
    sectionLines,
    lineNumbersBefore,
    linesBefore,
    lineNumbersAfter,
    linesAfter,
  ];
}

function wrapSectionIndent(lines: Element[]): number {
  const indents: [string, Element[], Element][] = [];

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    const indentElements: Element[] = [];
    let indent = "";

    for (const child of line.children) {
      if (child.type !== "element") break;
      const classList = createClassList(child);
      if (
        !classList.contains(cssClass.space) &&
        !classList.contains(cssClass.tab)
      ) {
        break;
      }
      const [text] = child.children;
      if (text?.type !== "text") continue;

      indentElements.push(child);
      indent += text.value;
    }

    indents.push([indent, indentElements, line]);
  }

  let minIndentCharCount = Infinity;
  let indent = "";
  let indentElements: Element[] = [];

  for (const [lineIndent, lineIndentElements] of indents) {
    const indentCharCount = lineIndent.length;

    if (indentCharCount >= 0 && indentCharCount < minIndentCharCount) {
      minIndentCharCount = indentCharCount;
      indent = lineIndent;
      indentElements = lineIndentElements;
    }
  }

  for (const [lineIndent] of indents) {
    if (!lineIndent.startsWith(indent)) {
      // Indent is inconsistent
      return 0;
    }
  }

  let indentWidth = 0;
  for (const char of indent) {
    if (char === " ") {
      ++indentWidth;
    } else if (char === "\t") {
      indentWidth += 2;
    }
  }

  for (const [, , line] of indents) {
    line.children.splice(0, indentElements.length, {
      type: "element",
      tagName: "span",
      children: indentElements,
      properties: {
        className: [SECTION_CONTENT_INDENT_CLASS],
      },
    });
  }

  return indentWidth;
}
