import clsx from "clsx";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, type CSSProperties } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import styles from "./Highlight.module.css";
import { codeToHast, type Language } from "./shiki";
import { collapseNewlines as collapseNewlinesTransformer } from "./transformer/collapse-newlines";
import { lineNumbers as lineNumbersTransformer } from "./transformer/line-numbers";
import { notationSections as notationSectionsTransformer } from "./transformer/notation-sections";
import { removeNotationEscape as removeNotationEscapeTransformer } from "./transformer/remove-notation-escape";
import { renderWhitespace as renderWhitespaceTransformer } from "./transformer/render-whitespace";
import { section as sectionTransformer } from "./transformer/section";
import { stripNotations as stripNotationsTransformer } from "./transformer/strip-notations";

type Props = {
  copyId: string;
  lang: Language;
  source: string;
  section: string | undefined;
  sectionId: string;
  lineNumbers: boolean;
};

export default async function Highlight({
  copyId,
  lang,
  source,
  section,
  sectionId,
  lineNumbers,
}: Props) {
  const tree = await codeToHast(source.replace(/\n+$/, ""), {
    lang,
    theme: "github-dark-default",
    transformers: [
      collapseNewlinesTransformer,
      notationSectionsTransformer,
      stripNotationsTransformer,
      removeNotationEscapeTransformer,
      lineNumbersTransformer,
      renderWhitespaceTransformer,
      ...(section ? [sectionTransformer(section, sectionId)] : []),
    ],
  });

  return toJsxRuntime(tree, {
    Fragment,
    jsx,
    jsxs,
    components: {
      pre: ({
        className,
        ...props
      }: { className: string; style: CSSProperties } & Record<
        string,
        unknown
      >) => (
        <pre
          id={copyId}
          className={clsx(
            className,
            styles.pre,
            "mt-0 rounded-b rounded-t-none font-mono text-sm",
            { [styles.lineNumbers]: lineNumbers },
          )}
          {...props}
        />
      ),
    },
  });
}
