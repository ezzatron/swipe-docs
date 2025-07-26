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
    <pre className="flex bg-zinc-900">
      {lineNumbers && (
        <div className="flex-shrink-0 pr-4 text-right text-zinc-500">
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
        className="[&_.imp-sc-i]:hidden"
      />
    </pre>
  );
}
