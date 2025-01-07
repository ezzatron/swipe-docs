import type { ShikiTransformer } from "shiki";

export function section(name: string): ShikiTransformer {
  return {
    name: `section-${name}`,

    code(code) {
      let hasSection = false;

      for (let i = code.children.length - 1; i >= 0; --i) {
        const line = code.children[i];
        if (line.type !== "element") continue;

        const sectionsData = line.properties["data-sections"];
        const sections =
          typeof sectionsData === "string" ? sectionsData.split(" ") : [];

        if (sections.includes(name)) {
          hasSection = true;
        } else {
          line.properties.hidden = true;
        }
      }

      if (!hasSection) throw new Error(`Missing code section ${name}`);
    },
  };
}
