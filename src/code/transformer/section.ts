import type { Element } from "hast";
import type { ShikiTransformer } from "shiki";
import { stripLastNewline } from "../lines";

export function section(
  name: string,
  id: string,
  renderContext: boolean,
): ShikiTransformer {
  return {
    name: `section-${name}-${id}`,

    code(code) {
      const expandedId = `${id}-expanded`;
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

      stripLastNewline(sectionLines);

      this.pre.properties["data-section"] = name;
      code.children = [
        {
          type: "element",
          tagName: "div",
          properties: { class: "section-content" },
          children: sectionLines,
        },
      ];

      if (renderContext && linesBefore.length > 0) {
        stripLastNewline(linesBefore);

        code.children.unshift(
          {
            type: "element",
            tagName: "div",
            properties: { class: "section-context" },
            children: linesBefore,
          },
          createExpander(expandedId),
        );
      }

      if (renderContext && linesAfter.length > 0) {
        code.children.push(createExpander(expandedId), {
          type: "element",
          tagName: "div",
          properties: { class: "section-context" },
          children: linesAfter,
        });
      }

      if (renderContext) {
        this.pre.children.push({
          type: "element",
          tagName: "input",
          properties: {
            type: "checkbox",
            id: expandedId,
            class: "section-expanded",
            hidden: true,
            ariaLabel: "Show more",
          },
          children: [],
        });
      }

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

function createExpander(expandedId: string): Element {
  return {
    type: "element",
    tagName: "label",
    properties: { for: expandedId, class: "section-expander" },
    children: [
      {
        type: "element",
        tagName: "div",
        properties: {
          class: "section-expander-show",
          ariaLabel: "Show more",
          title: "Show more",
        },
        children: [],
      },
      {
        type: "element",
        tagName: "div",
        properties: {
          class: "section-expander-hide",
          ariaLabel: "Show less",
          title: "Show less",
        },
        children: [],
      },
    ],
  };
}
