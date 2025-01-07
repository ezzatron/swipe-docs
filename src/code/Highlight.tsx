import clsx from "clsx";
import type { Root } from "hast";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, type CSSProperties } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import {
  codeToHast,
  type BundledLanguage,
  type ShikiTransformer,
  type SpecialLanguage,
} from "shiki";
import styles from "./Highlight.module.css";
import { notationSections as notationSectionsTransformer } from "./transformer/notation-sections";
import { removeNotationEscape as removeNotationEscapeTransformer } from "./transformer/remove-notation-escape";
import { stripNotations as stripNotationsTransformer } from "./transformer/strip-notations";

type Props = {
  codeId: string;
  lang: BundledLanguage | SpecialLanguage;
  source: string;
};

export default async function Highlight({ codeId, lang, source }: Props) {
  const transformers: ShikiTransformer[] = [
    notationSectionsTransformer,
    stripNotationsTransformer,
    removeNotationEscapeTransformer,
  ];

  const tree = await codeToHast(source.replace(/\n+$/, ""), {
    lang,
    theme: "github-dark-default",
    transformers,
  });
  const lineNumberWidth = countLines(tree).toString().length;

  return toJsxRuntime(tree, {
    Fragment,
    jsx,
    jsxs,
    components: {
      code: (props) => <code {...props} id={codeId} />,

      pre: ({
        className,
        style,
        ...props
      }: { className: string; style: CSSProperties } & Record<
        string,
        unknown
      >) => (
        <pre
          className={clsx(
            className,
            styles.pre,
            "mt-0 rounded-b rounded-t-none font-mono text-sm",
          )}
          style={
            {
              ...style,
              "--line-number-width": `${lineNumberWidth}ch`,
            } as CSSProperties
          }
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
