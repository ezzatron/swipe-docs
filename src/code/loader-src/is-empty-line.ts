import type { Element } from "hast";

export function isEmptyLine(line: Element): boolean {
  for (const node of line.children) {
    if (node.type !== "text" || node.value.trim()) return false;
  }

  return true;
}
