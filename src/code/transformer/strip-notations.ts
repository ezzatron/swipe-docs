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
        if (!comment) continue;

        const [, start, notations, end = ""] = comment;

        if (!NOTATION_PATTERN.test(notations)) continue;

        hasNotations = true;
        const content = notations.replaceAll(NOTATION_PATTERN, " ").trim();

        if (content) {
          // comment still has content after stripping notations
          text.value = `${start}${content}${end}`;
        } else {
          // empty comment after stripping notations, remove it
          line.children.splice(j, 1);

          // strip trailing whitespace from any previous element
          const prevSibling = line.children[j - 1];
          if (prevSibling?.type === "element") {
            const prevText =
              prevSibling.children[prevSibling.children.length - 1];

            if (prevText?.type === "text") {
              prevText.value = prevText.value.trimEnd();
            }
          }
        }
      }

      if (!hasNotations) continue;

      let hasContent = false;

      for (let j = line.children.length - 1; j >= 0; --j) {
        const child = line.children[j];
        hasContent = child.type !== "text" || child.value !== "\n";
        if (hasContent) break;
      }

      if (!hasContent) code.children.splice(i, 1);
    }
  },
};
