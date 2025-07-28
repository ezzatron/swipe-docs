import clsx from "clsx";
import { dataAttribute, type SplitSectionResult } from "impasto";
import type { ReactNode } from "react";
import CodeBlockAPIKey from "./CodeBlockAPIKey";
import { CodeBlockCode } from "./impasto-react";

type Props = {
  splitResult: SplitSectionResult;
  noLineNumbers?: boolean;
  expanded?: boolean;
};

export default function CodeBlockPre({
  splitResult,
  noLineNumbers = false,
  expanded = false,
}: Props) {
  let lineNumbers: ReactNode | undefined;

  if (!noLineNumbers) {
    lineNumbers = expanded ? (
      <CodeBlockLineNumbers
        splitResult={splitResult}
        startLine={1}
        endLine={splitResult.lines.length}
      />
    ) : (
      <CodeBlockLineNumbers
        splitResult={splitResult}
        startLine={splitResult.content.startLine}
        endLine={splitResult.content.endLine}
      />
    );
  }

  return (
    <pre
      className={clsx(
        "scrollbar scrollbar-track-transparent scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 relative flex overflow-x-auto overflow-y-clip py-3 text-sm select-none [tab-size:2] selection:bg-blue-400/25 dark:selection:bg-blue-500/25",
        "[&_.imp-l]:pr-4",
        "[&_.imp-s]:before:content-['·'] [&_.imp-s,.imp-t]:relative [&_.imp-s,.imp-t]:before:absolute [&_.imp-s,.imp-t]:before:text-transparent [&_.imp-s.selected,.imp-t.selected]:before:text-zinc-400 dark:[&_.imp-s.selected,.imp-t.selected]:before:text-zinc-600 [&_.imp-t]:before:content-['→']",
        {
          "pl-4": noLineNumbers,
          "dark:bg-zinc-925 bg-zinc-100 [&_.imp-sc]:bg-white [&_.imp-sc]:dark:bg-zinc-900 [&_.imp-sc+.imp-sx]:pt-3 [&_.imp-sc:has(+.imp-sx)]:pb-3 [&_.imp-sx+.imp-sc]:pt-3 [&_.imp-sx:has(+.imp-sc)]:pb-3":
            expanded,
          "bg-zinc-100 dark:bg-zinc-900 [&_.imp-sc-i]:hidden": !expanded,
        },
      )}
    >
      {lineNumbers}

      <CodeBlockCode
        lines={expanded ? splitResult.lines : splitResult.content.lines}
        components={{
          span: (props) => {
            if (props[dataAttribute.redactionType] === "api-key") {
              return <CodeBlockAPIKey />;
            }

            return <span {...props} />;
          },
        }}
        className="[&_.imp-l]:select-text"
      />
    </pre>
  );
}

function CodeBlockLineNumbers({
  splitResult,
  startLine,
  endLine,
}: {
  splitResult: SplitSectionResult;
  startLine: number;
  endLine: number;
}) {
  const lineNumbers: ReactNode[] = [];

  for (let i = startLine; i <= endLine; ++i) {
    const isContent =
      i >= splitResult.content.startLine && i <= splitResult.content.endLine;

    lineNumbers.push(
      <div
        key={i}
        className={clsx("pr-6 pl-4", {
          "imp-sc": isContent,
          "imp-sx": !isContent,
        })}
      >
        {i}
      </div>,
    );
  }

  return (
    <div className="sticky left-0 flex-shrink-0 bg-inherit text-right text-zinc-500">
      {lineNumbers}
    </div>
  );
}
