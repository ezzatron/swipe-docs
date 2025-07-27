import clsx from "clsx";
import { dataAttribute, type LineElement } from "impasto";
import CodeBlockAPIKey from "./CodeBlockAPIKey";
import { CodeBlockCode } from "./impasto-react";

type Props = {
  lines: LineElement[];
  noLineNumbers?: boolean;
  startLine?: number;
};

export default function CodeBlockPre({
  lines,
  noLineNumbers = false,
  startLine = 1,
}: Props) {
  return (
    <pre
      className={clsx(
        "scrollbar scrollbar-track-transparent scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 relative flex overflow-x-auto overflow-y-clip bg-zinc-100 py-3 pr-4 text-sm select-none dark:bg-zinc-900",
        { "pl-4": noLineNumbers },
      )}
    >
      {!noLineNumbers && (
        <div className="sticky left-0 flex-shrink-0 bg-inherit pr-6 pl-4 text-right text-zinc-500">
          {lines.map((_, i) => (
            <div key={i}>{startLine + i}</div>
          ))}
        </div>
      )}

      <CodeBlockCode
        lines={lines}
        components={{
          span: (props) => {
            if (props[dataAttribute.redactionType] === "api-key") {
              return <CodeBlockAPIKey />;
            }

            return <span {...props} />;
          },
        }}
        className="[&_.imp-l]:select-text [&_.imp-sc-i]:hidden"
      />
    </pre>
  );
}
