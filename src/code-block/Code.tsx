import clsx from "clsx";
import { Pre, RawCode, highlight, type AnnotationHandler } from "codehike/code";
import { callout as calloutHandler } from "./annotations/callout";
import { lineNumbers as lineNumbersHandler } from "./annotations/line-numbers";
import {
  createSection,
  sectionAfter as sectionAfterHandler,
  sectionBefore as sectionBeforeHandler,
} from "./annotations/section";
import styles from "./Code.module.css";
import CopyButton from "./CopyButton";
import LanguageIcon from "./LanguageIcon";
import { parseMeta } from "./meta";

type Props = {
  codeblock: RawCode;
};

export default async function Code({ codeblock }: Props) {
  const highlighted = await highlight(
    {
      ...codeblock,
      value: codeblock.value.replaceAll(/(^\n+|\n+$)/g, ""),
    },
    "github-dark",
  );
  const { code, lang } = highlighted;
  const totalLines = code.split("\n").length;
  const meta = parseMeta(highlighted.meta);
  const {
    lineNumbers,
    section,
    title = lang === "shellscript" ? "Command Line" : undefined,
  } = meta;

  const handlers: AnnotationHandler[] = [
    createSection(totalLines, section),
    sectionBeforeHandler,
    sectionAfterHandler,
    calloutHandler,
    ...(lineNumbers ? [lineNumbersHandler] : []),
  ];

  return (
    <div className={clsx(styles.code, "mb-6 rounded border border-zinc-700")}>
      <div className="flex items-center justify-between rounded-t border-b border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-400">
        <div className="flex items-center gap-1">
          <LanguageIcon lang={lang} />
          <div className="translate-y-[1px]">{title}</div>
        </div>

        <CopyButton text={code} />
      </div>

      <Pre code={highlighted} handlers={handlers} className="mb-0 mt-0" />
    </div>
  );
}
