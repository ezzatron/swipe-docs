import { type Element } from "hast";
import { type Annotation } from "./annotation.js";
import { SECTION_DATA } from "./data.js";
import { type Mode } from "./mode.js";

export function addSections(
  mode: Mode,
  lines: Element[],
  annotations: Record<number, Annotation[]>,
): void {
  if (mode === "ignore") return;

  const seenSections = new Map<string, number>();
  const openSections = new Map<string, number>();

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    if (line.type !== "element") continue;
    const lineNumber = i + 1;
    const sections = new Map(openSections);

    for (const { source, name, value } of annotations[i]) {
      const isSingleLine = name === "section";
      const isStart = name === "section-start";
      const isEnd = name === "section-end";

      if (!isSingleLine && !isStart && !isEnd) continue;
      if (!value) {
        throw new Error(
          `Missing code section name on line ${lineNumber} ` +
            `in annotation ${source}`,
        );
      }
      if (!isEnd && seenSections.has(value)) {
        const seenLineNumber = seenSections.get(value);

        throw new Error(
          `Code section ${value} on line ${lineNumber} ` +
            `already seen on line ${seenLineNumber}`,
        );
      }

      seenSections.set(value, lineNumber);
      sections.set(value, lineNumber);
      if (isStart) openSections.set(value, lineNumber);
      if (isEnd) openSections.delete(value);
    }

    if (sections.size < 1) continue;

    line.properties[SECTION_DATA] = Array.from(sections.keys())
      .sort((a, b) => a.localeCompare(b))
      .join(" ");
  }

  if (openSections.size > 0) {
    const descriptions = Array.from(openSections)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, lineNumber]) => `${name} on line ${lineNumber}`);

    throw new Error(`Unclosed code sections: ${descriptions.join(", ")}`);
  }
}
