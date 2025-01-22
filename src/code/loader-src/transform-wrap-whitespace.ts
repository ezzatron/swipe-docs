import { type Element, type ElementContent, type Text } from "hast";
import { visit } from "unist-util-visit";
import { SPACE_CLASS, TAB_CLASS } from "./class.js";
import { WHITESPACE_PATTERN } from "./pattern.js";

const WHITESPACE_CLASS_MAP: Record<string, string> = {
  " ": SPACE_CLASS,
  "\t": TAB_CLASS,
};

export function wrapWhitespace(lines: Element[]): void {
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
