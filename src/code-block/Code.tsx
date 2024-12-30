import { Pre, RawCode, highlight, type AnnotationHandler } from "codehike/code";
import { callout } from "./annotations/callout";
import { lineNumbers } from "./annotations/line-numbers";
import CopyButton from "./CopyButton";

const FLAG_PATTERN = /^-(.*)$/;

type Props = {
  codeblock: RawCode;
};

export default async function Code({ codeblock }: Props) {
  const highlighted = await highlight(codeblock, "github-dark");
  const { code, meta } = highlighted;
  const [title, flags] = parseMeta(meta);

  const handlers: AnnotationHandler[] = [
    ...(flags.lineNumbers ? [lineNumbers] : []),
    callout,
  ];

  return (
    <div className="mb-6 rounded border border-zinc-700">
      <div className="flex justify-between rounded-t border-b border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
        <div>{title}</div>
        <CopyButton text={code} />
      </div>

      <Pre code={highlighted} handlers={handlers} className="mb-0 mt-0" />
    </div>
  );
}

type Flags = {
  lineNumbers: boolean;
};

function parseMeta(meta: string): [title: string, flags: Flags] {
  let title = "";
  const flags: Flags = {
    lineNumbers: false,
  };

  for (const part of meta.split(" ")) {
    const match = FLAG_PATTERN.exec(part);

    if (match) {
      if (match[1] === "n") flags.lineNumbers = true;
    } else {
      title = part;
    }
  }

  return [title, flags];
}
