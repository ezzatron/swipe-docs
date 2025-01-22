import { type Element } from "hast";
import { SECTION_DATA } from "./data.js";
import { isEmptyLine } from "./is-empty-line.js";
import { type Mode } from "./mode.js";

export function trimSectionLines(mode: Mode, lines: Element[]): void {
  if (mode === "ignore") return;

  const seenSections = new Set<string>();

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    if (typeof line.properties[SECTION_DATA] !== "string") continue;

    const lineSections = new Set(line.properties[SECTION_DATA].split(" "));
    const isEmpty = isEmptyLine(line);

    for (const section of lineSections) {
      if (isEmpty && !seenSections.has(section)) {
        lineSections.delete(section);

        continue;
      }

      seenSections.add(section);
    }

    if (lineSections.size < 1) {
      delete line.properties[SECTION_DATA];
    } else {
      line.properties[SECTION_DATA] = Array.from(lineSections).join(" ");
    }
  }
}
