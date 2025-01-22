import { type Element, type ElementContent } from "hast";
import { visit } from "unist-util-visit";
import { API_KEY_PATTERN } from "./pattern.js";

const TEST_KEY = "sk_test_006fdtrt32aTIPl7OaDEADC0DE";

export function redactKeys(lines: Element[]): void {
  visit(
    { type: "root", children: lines },
    "text",
    (node, index, parent) => {
      if (!parent || index == null) return;

      const nonKeys: string[] = [];
      let keyCount = 0;

      API_KEY_PATTERN.lastIndex = 0;
      let match = API_KEY_PATTERN.exec(node.value);
      let lastIndex = 0;

      while (match) {
        ++keyCount;
        nonKeys.push(node.value.slice(lastIndex, match.index));
        lastIndex = API_KEY_PATTERN.lastIndex;
        match = API_KEY_PATTERN.exec(node.value);
      }

      nonKeys.push(node.value.slice(lastIndex));

      const replacement: ElementContent[] = [];
      let i = 0;

      for (; i < keyCount; i++) {
        replacement.push({ type: "text", value: nonKeys[i] });
        replacement.push({
          type: "element",
          tagName: "span",
          properties: { class: "cb-k" },
          children: [{ type: "text", value: TEST_KEY }],
        });
      }

      replacement.push({ type: "text", value: nonKeys[i] });

      parent.children.splice(index, 1, ...replacement);
    },
    true,
  );
}
