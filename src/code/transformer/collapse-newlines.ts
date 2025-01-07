import type { ShikiTransformer } from "shiki";

export const collapseNewlines: ShikiTransformer = {
  name: "collapse-newlines",

  code(code) {
    for (let i = code.children.length - 1; i >= 0; --i) {
      const line = code.children[i];
      if (line.type !== "element") continue;

      const nextSibling = code.children[i + 1];
      const hasNewline =
        nextSibling?.type === "text" && nextSibling.value === "\n";

      if (!hasNewline) continue;

      code.children.splice(i + 1, 1);
      line.children.push(nextSibling);
    }
  },
};
