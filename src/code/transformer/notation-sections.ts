import type { ShikiTransformer } from "shiki";
import { COMMENT_PATTERN, NOTATION_PATTERN } from "./pattern";

export const notationSections: ShikiTransformer = {
  name: "notation-sections",

  code(code) {
    const openSections: Set<string> = new Set();

    for (let i = 0; i < code.children.length; ++i) {
      const line = code.children[i];
      if (line.type !== "element") continue;

      const sections: Set<string> = new Set(openSections);

      for (let j = 0; j < line.children.length; ++j) {
        const child = line.children[j];
        if (child.type !== "element") continue;
        const [text] = child.children;
        if (text.type !== "text") continue;
        const comment = COMMENT_PATTERN.exec(text.value);
        if (!comment) continue;
        const notations = comment[2].matchAll(NOTATION_PATTERN);
        if (!notations) continue;

        for (const [notation, name, params] of notations) {
          const isSingleLine = name === "section";
          const isStart = name === "section-start";
          const isEnd = name === "section-end";

          if (!isSingleLine && !isStart && !isEnd) continue;
          if (!params) {
            throw new Error(`Missing section name in notation ${notation}`);
          }

          sections.add(params);
          if (isStart) openSections.add(params);
          if (isEnd) openSections.delete(params);
        }
      }

      if (sections.size < 1) continue;

      line.properties["data-section"] = Array.from(sections).sort().join(" ");
    }

    return code;
  },
};
