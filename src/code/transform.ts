import clsx from "clsx";
import type { Element, Root } from "hast";
import {
  CODE_BLOCK_CLASS,
  LINE_NUMBERS_CLASS,
  LINE_NUMBERS_SHOW_CLASS,
  SECTION_CONTENT_CLASS,
  SECTION_CONTENT_INDENT_CLASS,
  SECTION_CONTEXT_AFTER_CLASS,
  SECTION_CONTEXT_BEFORE_CLASS,
  SECTION_CONTEXT_CLASS,
  SECTION_EXPANDER_AFTER_CLASS,
  SECTION_EXPANDER_BEFORE_CLASS,
  SECTION_EXPANDER_CLASS,
  SECTION_EXPANDER_HIDE_CLASS,
  SECTION_EXPANDER_SHOW_CLASS,
  SPACE_CLASS,
  TAB_CLASS,
} from "./loader/class";

const SECTION_DATA = "data-s";

type Options = {
  id: string;
  showLineNumbers: boolean;
  section?: string;
  noSectionContext: boolean;
};

export function transform(
  tree: Root,
  { id, showLineNumbers, section, noSectionContext }: Options,
): Root {
  const [pre] = structuredClone(tree).children;
  if (pre?.type !== "element" || pre.properties.class !== CODE_BLOCK_CLASS) {
    throw new Error("Unexpected tree");
  }
  const [content] = pre.children;
  if (
    content?.type !== "element" ||
    content.properties.class !== SECTION_CONTENT_CLASS
  ) {
    throw new Error("Unexpected tree");
  }
  const [lineNumberContainer, code] = content.children;
  if (
    lineNumberContainer?.type !== "element" ||
    lineNumberContainer.properties.class !== LINE_NUMBERS_CLASS ||
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
  const hasBefore = linesBefore.length > 0;
  const hasAfter = linesAfter.length > 0;
  const hasContext = hasBefore || hasAfter;

  if (section) wrapSectionIndent(sectionLines);

  Object.assign(pre, {
    properties: {
      ...pre.properties,
      id,
      class: clsx(pre.properties.class, {
        [LINE_NUMBERS_SHOW_CLASS]: showLineNumbers,
      }),
      "data-s": section,
    },
    children: [
      {
        type: "element",
        tagName: "div",
        properties: { class: SECTION_CONTENT_CLASS },
        children: [
          { ...lineNumberContainer, children: sectionLineNumbers },
          { ...code, children: sectionLines },
        ],
      },
    ],
  });

  const result: Root = { type: "root", children: [pre] };

  if (noSectionContext || !hasContext) return result;

  if (hasBefore) {
    pre.children.unshift(
      {
        type: "element",
        tagName: "div",
        properties: {
          class: `${SECTION_CONTEXT_CLASS} ${SECTION_CONTEXT_BEFORE_CLASS}`,
        },
        children: [
          { ...lineNumberContainer, children: lineNumbersBefore },
          { ...code, children: linesBefore },
        ],
      },
      createSectionExpander(SECTION_EXPANDER_BEFORE_CLASS),
    );
  }

  if (hasAfter) {
    pre.children.push(createSectionExpander(SECTION_EXPANDER_AFTER_CLASS), {
      type: "element",
      tagName: "div",
      properties: {
        class: `${SECTION_CONTEXT_CLASS} ${SECTION_CONTEXT_AFTER_CLASS}`,
      },
      children: [
        { ...lineNumberContainer, children: lineNumbersAfter },
        { ...code, children: linesAfter },
      ],
    });
  }

  return result;
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

    const sectionsData = line.properties[SECTION_DATA];
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

function wrapSectionIndent(lines: Element[]): void {
  const indents: [string, Element[], Element][] = [];

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    const indentElements: Element[] = [];
    let indent = "";

    for (const child of line.children) {
      if (child.type !== "element") break;
      if (typeof child.properties.class !== "string") break;
      const classes = String(child.properties.class).split(" ");
      if (!classes.includes(SPACE_CLASS) && !classes.includes(TAB_CLASS)) break;
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
  let hasConsistentIndent = true;

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
      hasConsistentIndent = false;

      break;
    }
  }

  if (hasConsistentIndent) {
    for (const [, , line] of indents) {
      line.children.splice(0, indentElements.length, {
        type: "element",
        tagName: "span",
        children: indentElements,
        properties: { class: SECTION_CONTENT_INDENT_CLASS },
      });
    }
  }
}

function createSectionExpander(className: string): Element {
  return {
    type: "element",
    tagName: "label",
    properties: { class: `${SECTION_EXPANDER_CLASS} ${className}` },
    children: [
      {
        type: "element",
        tagName: "input",
        properties: {
          type: "checkbox",
          hidden: true,
          ariaLabel: "Show more",
        },
        children: [],
      },
      {
        type: "element",
        tagName: "div",
        properties: {
          class: SECTION_EXPANDER_SHOW_CLASS,
          ariaLabel: "Show more",
          title: "Show more",
        },
        children: [],
      },
      {
        type: "element",
        tagName: "div",
        properties: {
          class: SECTION_EXPANDER_HIDE_CLASS,
          ariaLabel: "Show less",
          title: "Show less",
        },
        children: [],
      },
    ],
  };
}
