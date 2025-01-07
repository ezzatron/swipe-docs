import type { ShikiTransformer } from "shiki";
import { addStyle } from "./style";

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

    const lineNumberWidth = lineCount.toString().length;
    addStyle(this.pre, `--line-number-width:${lineNumberWidth}ch`);
  },
};
