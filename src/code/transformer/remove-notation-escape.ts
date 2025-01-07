import type { ShikiTransformer } from "shiki";
import { COMMENT_PATTERN, ESCAPED_NOTATION_PATTERN } from "./pattern";

export const removeNotationEscape: ShikiTransformer = {
  name: "remove-notation-escape",

  code(code) {
    for (let i = code.children.length - 1; i >= 0; --i) {
      const line = code.children[i];
      if (line.type !== "element") continue;

      for (let j = line.children.length - 1; j >= 0; --j) {
        const child = line.children[j];
        if (child.type !== "element") continue;
        const [text] = child.children;
        if (text.type !== "text") continue;
        const comment = COMMENT_PATTERN.exec(text.value);
        if (!comment) continue;

        const [, start, escaped, end = ""] = comment;

        if (!ESCAPED_NOTATION_PATTERN.test(escaped)) continue;

        const content = escaped.replaceAll(ESCAPED_NOTATION_PATTERN, "[$1");
        text.value = `${start}${content}${end}`;
      }
    }
  },
};
