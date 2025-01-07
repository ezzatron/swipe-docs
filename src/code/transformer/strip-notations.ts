import type { ShikiTransformer } from "shiki";
import { COMMENT_PATTERN, NOTATION_PATTERN } from "./pattern";

export const stripNotations: ShikiTransformer = {
  name: "strip-notations",

  code(code) {
    for (let i = code.children.length - 1; i >= 0; --i) {
      const line = code.children[i];
      if (line.type !== "element") continue;

      let hasNotations = false;

      for (let j = line.children.length - 1; j >= 0; --j) {
        const child = line.children[j];
        if (child.type !== "element") continue;
        const [text] = child.children;
        if (text.type !== "text") continue;
        const comment = COMMENT_PATTERN.exec(text.value);
        if (!comment || !NOTATION_PATTERN.test(comment[2])) continue;

        hasNotations = true;
        const content = comment[2].replaceAll(NOTATION_PATTERN, " ").trim();

        if (content) {
          // comment still has content after stripping notations
          const [, start, , end = ""] = comment;
          text.value = `${start}${content}${end}`;
        } else {
          // empty comment after stripping notations, remove it
          line.children.splice(j, 1);
        }
      }

      if (!hasNotations || line.children.length > 0) continue;

      const nextSibling = code.children[i + 1];
      const hasNewline =
        nextSibling?.type === "text" && nextSibling.value === "\n";

      code.children.splice(i, hasNewline ? 2 : 1);
    }

    return code;
  },
};
