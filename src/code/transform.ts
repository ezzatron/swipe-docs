import type { Element, ElementContent, Root, Text } from "hast";
import { visit } from "unist-util-visit";

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

const CODE_BLOCK_CLASS = "cb";
const LINE_CLASS = `${CODE_BLOCK_CLASS}-l`;
const LINE_NUMBER_CLASS = `${CODE_BLOCK_CLASS}-n`;
const LINE_NUMBERS_CLASS = `${CODE_BLOCK_CLASS}-ln`;
const SECTION_CONTENT_CLASS = `${CODE_BLOCK_CLASS}-sc`;
const SECTION_CONTENT_INDENT_CLASS = `${SECTION_CONTENT_CLASS}-i`;
const SECTION_CONTEXT_CLASS = `${CODE_BLOCK_CLASS}-sx`;
const SECTION_EXPANDED_CLASS = `${CODE_BLOCK_CLASS}-se`;
const SECTION_EXPANDER_CLASS = `${CODE_BLOCK_CLASS}-sh`;
const SECTION_EXPANDER_HIDE_CLASS = `${SECTION_EXPANDER_CLASS}-h`;
const SECTION_EXPANDER_SHOW_CLASS = `${SECTION_EXPANDER_CLASS}-s`;
const SPACE_CLASS = `${CODE_BLOCK_CLASS}-s`;
const TAB_CLASS = `${CODE_BLOCK_CLASS}-t`;

const WHITESPACE_CLASS_MAP: Record<string, string> = {
  " ": SPACE_CLASS,
  "\t": TAB_CLASS,
};

const SECTION_DATA = "data-s";

type Options = {
  id: string;
  lineNumbers: boolean;
  section?: string;
  noSectionContext: boolean;
  noAnnotations: boolean;
};

export function transform(
  tree: Root,
  { id, lineNumbers, section, noSectionContext, noAnnotations }: Options,
): Root {
  const lines: Element[] = splitLines(tree);
  const [annotations, annotationComments] = parseAnnotations(
    lines,
    noAnnotations,
  );

  if (!noAnnotations) addSections(lines, annotations);
  cleanupLines(lines, annotationComments);
  if (!noAnnotations) trimSectionLines(lines);
  if (!noAnnotations) trimSectionLines(lines.toReversed());
  wrapWhitespace(lines);

  const [sectionLines, linesBefore, linesAfter] = splitSection(
    lines,
    section,
    noAnnotations,
  );
  const hasBefore = linesBefore.length > 0;
  const hasAfter = linesAfter.length > 0;
  const hasContext = hasBefore || hasAfter;

  if (!noAnnotations) wrapSectionIndent(sectionLines);

  const pre: Element = {
    type: "element",
    tagName: "pre",
    properties: { id, class: CODE_BLOCK_CLASS, "data-s": section },
    children: [
      fillCodeSection(
        sectionLines,
        lineNumbers,
        linesBefore.length + 1,
        lines.length,
        {
          type: "element",
          tagName: "div",
          properties: { class: SECTION_CONTENT_CLASS },
          children: [],
        },
      ),
    ],
  };
  const result: Root = { type: "root", children: [pre] };

  if (noSectionContext || !hasContext) return result;

  const expandedId = `${id}-expanded`;
  pre.children.push({
    type: "element",
    tagName: "input",
    properties: {
      type: "checkbox",
      id: expandedId,
      class: SECTION_EXPANDED_CLASS,
      hidden: true,
      ariaLabel: "Show more",
    },
    children: [],
  });

  if (hasBefore) {
    pre.children.unshift(
      fillCodeSection(linesBefore, lineNumbers, 1, lines.length, {
        type: "element",
        tagName: "div",
        properties: { class: SECTION_CONTEXT_CLASS },
        children: [],
      }),
      createSectionExpander(expandedId),
    );
  }

  if (hasAfter) {
    pre.children.push(
      createSectionExpander(expandedId),
      fillCodeSection(
        linesAfter,
        lineNumbers,
        linesBefore.length + sectionLines.length + 1,
        lines.length,
        {
          type: "element",
          tagName: "div",
          properties: { class: SECTION_CONTEXT_CLASS },
          children: [],
        },
      ),
    );
  }

  return result;
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
  noAnnotations: boolean,
): [
  annotations: Record<number, Annotation[]>,
  comments: Map<Text, AnnotationComment>,
] {
  const annotations: Record<number, Annotation[]> = {};
  const comments: Map<Text, [start: string, content: string, end: string]> =
    new Map();

  if (noAnnotations) return [annotations, comments];

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

function splitSection(
  lines: Element[],
  name: string | undefined,
  noAnnotations: boolean,
): [sectionLines: Element[], linesBefore: Element[], linesAfter: Element[]] {
  if (noAnnotations || !name) return [lines, [], []];

  const sectionLines: Element[] = [];
  const linesBefore: Element[] = [];
  const linesAfter: Element[] = [];
  let hasSection = false;

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    if (line.type !== "element") continue;

    const sectionsData = line.properties[SECTION_DATA];
    const sections =
      typeof sectionsData === "string" ? sectionsData.split(" ") : [];

    if (sections.includes(name)) {
      hasSection = true;
      sectionLines.push(line);
    } else if (hasSection) {
      linesAfter.push(line);
    } else {
      linesBefore.push(line);
    }
  }

  if (!hasSection) throw new Error(`Missing code section ${name}`);

  return [sectionLines, linesBefore, linesAfter];
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

function createSectionExpander(expandedId: string): Element {
  return {
    type: "element",
    tagName: "label",
    properties: { for: expandedId, class: SECTION_EXPANDER_CLASS },
    children: [
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

function fillCodeSection(
  lines: Element[],
  lineNumbers: boolean,
  startLine: number,
  totalLines: number,
  parent: Element,
): Element {
  if (lineNumbers) {
    parent.children.push(
      createLineNumbers(startLine, lines.length, totalLines),
    );
  }

  parent.children.push({
    type: "element",
    tagName: "code",
    properties: {},
    children: lines,
  });

  return parent;
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
    properties: { class: LINE_NUMBERS_CLASS, style: `width: ${width}` },
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
