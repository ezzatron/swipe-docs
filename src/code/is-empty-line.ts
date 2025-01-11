import type { ElementContent } from "hast";

export function isEmptyLine(line: ElementContent): boolean {
  if (line.type !== "element") return false;
  if (line.children.length > 1) return false;
  if (line.children.length === 0) return true;

  const [child] = line.children;

  if (child.type === "text") return child.value === "\n";
  if (child.type !== "element") return false;

  const [text] = child.children;

  return text?.type === "text" && text.value === "";
}
