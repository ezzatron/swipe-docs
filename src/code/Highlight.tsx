import clsx from "clsx";
import type { Root } from "hast";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { type BundledLanguage, type SpecialLanguage } from "shiki";
import { codeToHast } from "shiki/index.mjs";
import styles from "./Highlight.module.css";
import { notationFocus } from "./transformer/notation-focus";

type Props = {
  lang: BundledLanguage | SpecialLanguage;
  source: string;
};

export default async function Highlight({ lang, source }: Props) {
  const tree = await codeToHast(source, {
    lang,
    theme: "github-dark-default",
    transformers: [notationFocus],
  });
  const lineNumberWidth = countLines(tree).toString().length;

  return toJsxRuntime(tree, {
    Fragment,
    jsx,
    jsxs,
    components: {
      code: (props) => (
        <code
          {...props}
          style={{ "--line-number-width": `${lineNumberWidth}ch` }}
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
