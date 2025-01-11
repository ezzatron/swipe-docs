import type { ElementContent } from "hast";
import type { ShikiTransformer } from "shiki";

export const collapseEmptyLines: ShikiTransformer = {
  name: "collapse-empty-lines",

  code(code) {
    let isFollowingEmpty = false;

    for (let i = code.children.length - 1; i >= 0; --i) {
      const line = code.children[i];
      if (line.type !== "element") continue;

      const isEmpty = isEmptyLine(line);

      if (
        isEmpty &&
        (isFollowingEmpty || i === 0 || i === code.children.length - 1)
      ) {
        code.children.splice(i, 1);
      }

      isFollowingEmpty = isEmpty;
    }

    const firstLine = code.children[0];
    if (isEmptyLine(firstLine)) code.children.shift();

    const lastLine = code.children[code.children.length - 1];

    if (lastLine?.type === "element") {
      const lastChild = lastLine.children[lastLine.children.length - 1];

      if (lastChild?.type === "text" && lastChild.value === "\n") {
        lastLine.children.pop();
      }
    }
  },
};

function isEmptyLine(content: ElementContent): boolean {
  if (content.type !== "element") return false;
  if (content.children.length > 1) return false;
  if (content.children.length === 0) return true;

  const [child] = content.children;

  return child.type === "text" && child.value === "\n";
}
