import { type Element, type Root } from "hast";
import { LINE_CLASS } from "./class.js";

export function splitLines(tree: Root): Element[] {
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

function emptyLine(): Element {
  return {
    type: "element",
    tagName: "div",
    properties: { class: LINE_CLASS },
    children: [],
  };
}
