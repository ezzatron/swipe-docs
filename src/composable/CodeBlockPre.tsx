import clsx from "clsx";
import { dataAttribute, type LineElement } from "impasto";
import CodeBlockAPIKey from "./CodeBlockAPIKey";
import { CodeBlockCode } from "./impasto-react";

type Props = {
  lines: LineElement[];
  lineNumbers?: boolean;
  startLine?: number;
};

export default function CodeBlockPre({
  lines,
  lineNumbers = false,
  startLine = 1,
}: Props) {
  return (
    <pre
      className={clsx(
        "relative flex overflow-x-auto overflow-y-clip bg-zinc-900 py-3 pr-4 text-sm select-none",
        { "pl-4": !lineNumbers },
      )}
    >
      {lineNumbers && (
        <div className="sticky left-0 flex-shrink-0 bg-zinc-900 pr-6 pl-4 text-right text-zinc-500">
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
