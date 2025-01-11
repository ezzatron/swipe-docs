import type { ElementContent } from "hast";
import type { ShikiTransformer } from "shiki";
import { isEmptyLine } from "../lines";

export const trimSections: ShikiTransformer = {
  name: "trim-sections",

  code(code) {
    trimLines(code.children);
    trimLines(code.children.toReversed());
  },
};

function trimLines(lines: ElementContent[]): void {
  const seenSections = new Set<string>();

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    if (line.type !== "element") continue;
    if (typeof line.properties["data-sections"] !== "string") continue;

    const lineSections = new Set(line.properties["data-sections"].split(" "));
    const isEmpty = isEmptyLine(line);

    for (const section of lineSections) {
      if (isEmpty && !seenSections.has(section)) {
        lineSections.delete(section);

        continue;
      }

      seenSections.add(section);
    }

    line.properties["data-sections"] = Array.from(lineSections).join(" ");
  }
}
