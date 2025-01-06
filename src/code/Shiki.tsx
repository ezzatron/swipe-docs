import clsx from "clsx";
import type { Root } from "hast";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import styles from "./Shiki.module.css";

type Props = {
  tree: Root;
};

export default function Shiki({ tree }: Props) {
  const startLine = 123;
  const lineCount = countLines(tree);
  const endLine = startLine + lineCount - 1;
  const lineNumberWidth = `${endLine.toString().length}ch`;

  return toJsxRuntime(tree, {
    Fragment,
    jsx,
    jsxs,
    components: {
      code: (props) => (
        <code
          {...props}
          style={{
            "--line-number-width": lineNumberWidth,
            "--start-line": startLine,
          }}
        />
      ),

      pre: ({
        className,
        ...props
      }: { className: string } & Record<string, unknown>) => (
        <pre
          className={clsx(
            className,
            styles.pre,
            "mt-0 rounded-b rounded-t-none font-mono text-sm",
          )}
          {...props}
        />
      ),
    },
  });
}

function countLines(root: Root): number {
  const [pre] = root.children;

  if (pre?.type !== "element" || pre?.tagName !== "pre") {
    throw new Error("Unexpected Shiki AST content");
  }

  const [code] = pre.children;

  if (code?.type !== "element" || code?.tagName !== "code") {
    throw new Error("Unexpected Shiki AST content");
  }

  let lineCount = 0;

  for (const child of code.children) {
    if (child.type === "element" && child.properties.class === "line") {
      ++lineCount;
    }
  }

  return lineCount;
}
