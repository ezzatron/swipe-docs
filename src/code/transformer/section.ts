import type { Element, Text } from "hast";
import type { ShikiTransformer } from "shiki";

export function section(name: string): ShikiTransformer {
  return {
    name: `section-${name}`,

    code(code) {
      const sectionLines: [Text, Element][] = [];
      let hasSection = false;

      for (let i = 0; i < code.children.length; ++i) {
        const line = code.children[i];
        if (line.type !== "element") continue;

        const sectionsData = line.properties["data-sections"];
        const sections =
          typeof sectionsData === "string" ? sectionsData.split(" ") : [];

        if (!sections.includes(name)) {
          line.properties.hidden = true;

          continue;
        }

        hasSection = true;

        const [firstChild] = line.children;
        if (firstChild?.type !== "element") continue;
        const [text] = firstChild.children;

        if (text?.type === "text") sectionLines.push([text, line]);
      }

      if (!hasSection) throw new Error(`Missing code section ${name}`);

      this.pre.properties["data-section"] = name;

      let minIndentCharCount = Infinity;
      let indent = "";
      let hasConsistentIndent = true;

      for (const [text] of sectionLines) {
        const indentCharCount = text.value.search(/\S/);

        if (indentCharCount >= 0 && indentCharCount < minIndentCharCount) {
          minIndentCharCount = indentCharCount;
          indent = text.value.slice(0, indentCharCount);
        }
      }

      for (const [text] of sectionLines) {
        if (!text.value.startsWith(indent)) {
          hasConsistentIndent = false;

          break;
        }
      }

      if (!hasConsistentIndent) return;

      for (const [text, line] of sectionLines) {
        line.children.unshift({
          type: "element",
          tagName: "span",
          children: [{ type: "text", value: indent }],
          properties: { class: "section-indent" },
        });
        text.value = text.value.slice(indent.length);
      }
    },
  };
}
