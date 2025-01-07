import type { ShikiTransformer } from "shiki";
import { COMMENT_PATTERN, NOTATION_PATTERN } from "../pattern";

export const notationSections: ShikiTransformer = {
  name: "notation-sections",

  code(code) {
    const seenSections = new Map<string, number>();
    const openSections = new Map<string, number>();
    let lineNumber = 0;

    for (let i = 0; i < code.children.length; ++i) {
      const line = code.children[i];
      if (line.type !== "element") continue;

      ++lineNumber;
      const sections = new Map(openSections);

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
            throw new Error(
              `Missing code section name on line ${lineNumber} ` +
                `in notation ${notation}`,
            );
          }
          if (!isEnd && seenSections.has(params)) {
            const seenLineNumber = seenSections.get(params);

            throw new Error(
              `Code section ${params} on line ${lineNumber} ` +
                `already seen on line ${seenLineNumber}`,
            );
          }

          seenSections.set(params, lineNumber);
          sections.set(params, lineNumber);
          if (isStart) openSections.set(params, lineNumber);
          if (isEnd) openSections.delete(params);
        }
      }

      if (sections.size < 1) continue;

      line.properties["data-sections"] = Array.from(sections.keys())
        .sort((a, b) => a.localeCompare(b))
        .join(" ");
    }

    if (openSections.size > 0) {
      const descriptions = Array.from(openSections)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, lineNumber]) => `${name} on line ${lineNumber}`);

      throw new Error(`Unclosed code sections: ${descriptions.join(", ")}`);
    }
  },
};
