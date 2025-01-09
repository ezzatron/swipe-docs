import type { Element } from "hast";
import type { ShikiTransformer } from "shiki";

export function section(name: string): ShikiTransformer {
  return {
    name: `section-${name}`,

    code(code) {
      const linesBefore: Element[] = [];
      const sectionLines: Element[] = [];
      const linesAfter: Element[] = [];
      const sectionIndentation: [string, Element[], Element][] = [];
      let hasSection = false;

      for (let i = 0; i < code.children.length; ++i) {
        const line = code.children[i];
        if (line.type !== "element") continue;

        const sectionsData = line.properties["data-sections"];
        const sections =
          typeof sectionsData === "string" ? sectionsData.split(" ") : [];

        if (!sections.includes(name)) {
          if (hasSection) {
            linesAfter.push(line);
          } else {
            linesBefore.push(line);
          }

          continue;
        }

        hasSection = true;
        sectionLines.push(line);

        const [firstChild] = line.children;
        if (firstChild?.type !== "element") continue;
        const indentElements: Element[] = [];
        let indent = "";

        for (const child of firstChild.children) {
          if (child.type !== "element") continue;

          const classNames = String(child.properties.class ?? "").split(" ");

          if (!classNames.includes("space") && !classNames.includes("tab")) {
            continue;
          }

          const [text] = child.children;
          if (text?.type !== "text") continue;

          indentElements.push(child);
          indent += text.value;
        }

        sectionIndentation.push([indent, indentElements, firstChild]);
      }

      if (!hasSection) throw new Error(`Missing code section ${name}`);

      code.children = [
        {
          type: "element",
          tagName: "div",
          properties: { class: "section-context" },
          children: linesBefore,
        },
        {
          type: "element",
          tagName: "div",
          properties: { class: "section-content" },
          children: sectionLines,
        },
        {
          type: "element",
          tagName: "div",
          properties: { class: "section-context" },
          children: linesAfter,
        },
      ];

      let minIndentCharCount = Infinity;
      let indent = "";
      let indentElements: Element[] = [];
      let hasConsistentIndent = true;

      for (const [lineIndent, lineIndentElements] of sectionIndentation) {
        const indentCharCount = lineIndent.length;

        if (indentCharCount >= 0 && indentCharCount < minIndentCharCount) {
          minIndentCharCount = indentCharCount;
          indent = lineIndent;
          indentElements = lineIndentElements;
        }
      }

      for (const [lineIndent] of sectionIndentation) {
        if (!lineIndent.startsWith(indent)) {
          hasConsistentIndent = false;

          break;
        }
      }

      if (hasConsistentIndent) {
        for (const [, , firstChild] of sectionIndentation) {
          firstChild.children.splice(0, indentElements.length, {
            type: "element",
            tagName: "span",
            children: indentElements,
            properties: { class: "section-indent" },
          });
        }
      }
    },
  };
}
