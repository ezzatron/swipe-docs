import type { ElementContent } from "hast";

export function isEmptyLine(content: ElementContent): boolean {
  if (content.type !== "element") return false;
  if (content.children.length > 1) return false;
  if (content.children.length === 0) return true;

  const [child] = content.children;

  return child.type === "text" && child.value === "\n";
}
