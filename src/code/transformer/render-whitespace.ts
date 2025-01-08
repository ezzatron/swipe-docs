import type { Element, Text } from "hast";
import type { ShikiTransformer } from "shiki";

const WHITESPACE_PATTERN = /(?=[ \t])|(?<=[ \t])/g;

const CLASS_MAP: Record<string, string> = {
  " ": "space",
  "\t": "tab",
};

export const renderWhitespace: ShikiTransformer = {
  name: "render-whitespace",

  code(code) {
    for (let i = code.children.length - 1; i >= 0; --i) {
      const line = code.children[i];
      if (line.type !== "element") continue;

      for (let j = line.children.length - 1; j >= 0; --j) {
        const child = line.children[j];
        if (child.type !== "element") continue;
        const [text] = child.children;
        if (text.type !== "text") continue;

        const parts = text.value.split(WHITESPACE_PATTERN);
        const replacement: (Element | Text)[] = [];

        for (const part of parts) {
          const partText: Text = { type: "text", value: part };
          const className = CLASS_MAP[part];

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

        child.children.splice(0, 1, ...replacement);
      }
    }
  },
};
