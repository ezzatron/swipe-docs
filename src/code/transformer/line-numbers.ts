import type { ShikiTransformer } from "shiki";

export const lineNumbers: ShikiTransformer = {
  name: "line-numbers",

  code(code) {
    let lineCount = 0;

    for (let i = 0; i < code.children.length; ++i) {
      const line = code.children[i];
      if (line.type !== "element") continue;

      line.properties["data-line"] = i + 1;
      ++lineCount;
    }

    const { style: unknownStyle } = code.properties;
    const style = typeof unknownStyle === "string" ? unknownStyle : undefined;
    const lineNumberWidth = lineCount.toString().length;

    this.pre.properties.style = [
      ...(style?.split(";") ?? []),
      `--line-number-width:${lineNumberWidth}ch`,
    ].join(";");
  },
};
