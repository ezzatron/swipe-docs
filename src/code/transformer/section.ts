import type { ShikiTransformer } from "shiki";
import { addStyle } from "./style";

export function section(name: string): ShikiTransformer {
  return {
    name: `section-${name}`,

    code(code) {
      let hasSection = false;
      let minIndent = Infinity;

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
        if (text?.type !== "text") continue;

        const indent = text.value.search(/\S/);
        minIndent = Math.min(minIndent, indent);
      }

      if (!hasSection) throw new Error(`Missing code section ${name}`);

      this.pre.properties["data-section"] = name;
      addStyle(
        this.pre,
        `--section-min-indent:${Number.isFinite(minIndent) ? minIndent : 0}ch`,
      );
    },
  };
}
