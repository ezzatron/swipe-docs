import { Pre, RawCode, highlight, type AnnotationHandler } from "codehike/code";
import { callout } from "./annotations/callout";
import { createLineNumbers } from "./annotations/line-numbers";
import CopyButton from "./CopyButton";
import LanguageIcon from "./LanguageIcon";

type Props = {
  codeblock: RawCode;
};

export default async function Code({ codeblock }: Props) {
  const highlighted = await highlight(codeblock, "github-dark");
  const { code, lang } = highlighted;
  const { title, showLineNumbers, startLineNumber } = parseMeta(
    highlighted.meta,
  );

  const handlers: AnnotationHandler[] = [
    ...(showLineNumbers ? [createLineNumbers(startLineNumber)] : []),
    callout,
  ];

  return (
    <div className="mb-6 rounded border border-zinc-700">
      <div className="flex items-center justify-between rounded-t border-b border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
        <div className="flex items-center gap-1">
          <LanguageIcon lang={lang} />
          <div>{title}</div>
        </div>
        <CopyButton text={code} />
      </div>

      <Pre code={highlighted} handlers={handlers} className="mb-0 mt-0" />
    </div>
  );
}

type Meta = {
  title: string;
  showLineNumbers: boolean;
  startLineNumber: number;
};

function parseMeta(meta: string): Meta {
  const queryIndex = meta.indexOf("?");
  const titlePart = queryIndex < 0 ? meta : meta.slice(0, queryIndex);
  const queryPart = queryIndex < 0 ? "" : meta.slice(queryIndex + 1);
  const params = new URLSearchParams(queryPart);
  const showLineNumbersParam = params.get("line-numbers");
  const startLineNumberParam = params.get("start-line");

  const title = decodeURIComponent(titlePart);
  const showLineNumbers =
    typeof showLineNumbersParam === "string"
      ? showLineNumbersParam === "true"
      : true;
  const startLineNumber =
    typeof startLineNumberParam === "string"
      ? parseInt(startLineNumberParam, 10)
      : 1;

  return {
    title,
    showLineNumbers,
    startLineNumber,
  };
}
