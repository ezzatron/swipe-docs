import type { Element, Root } from "hast";
import {
  CODE_BLOCK_CLASS,
  LINE_NUMBER_CLASS,
  LINE_NUMBERS_CLASS,
} from "./class.js";
import type { Mode } from "./mode.js";
import { parseAnnotations } from "./parse-annotations.js";
import { splitLines } from "./split-lines.js";
import { addSections } from "./transform-add-sections.js";
import { cleanupLines } from "./transform-cleanup-lines.js";
import { redactKeys } from "./transform-redact-keys.js";
import { trimSectionLines } from "./transform-trim-section-lines.js";
import { wrapWhitespace } from "./transform-wrap-whitespace.js";

export type Options = {
  mode?: Mode;
};

export function transform(tree: Root, { mode = "strip" }: Options = {}): Root {
  const lines: Element[] = splitLines(tree);
  const [annotations, annotationComments] = parseAnnotations(mode, lines);
  addSections(mode, lines, annotations);
  cleanupLines(mode, lines, annotationComments);
  trimSectionLines(mode, lines);
  trimSectionLines(mode, lines.toReversed());
  redactKeys(lines);
  wrapWhitespace(lines);

  const pre: Element = {
    type: "element",
    tagName: "pre",
    properties: { class: CODE_BLOCK_CLASS },
    children: [
      createLineNumbers(lines.length),
      {
        type: "element",
        tagName: "code",
        properties: {},
        children: lines,
      },
    ],
  };

  return { type: "root", children: [pre] };
}

function createLineNumbers(count: number): Element {
  const numbers: Element = {
    type: "element",
    tagName: "div",
    properties: { class: LINE_NUMBERS_CLASS },
    children: [],
  };

  for (let i = 0; i < count; ++i) {
    numbers.children.push({
      type: "element",
      tagName: "div",
      properties: { class: LINE_NUMBER_CLASS },
      children: [{ type: "text", value: String(i + 1) }],
    });
  }

  return numbers;
}
