import type { LineElement } from "impasto";
import { CodeBlockCode } from "./impasto-react";

type Props = {
  lines: LineElement[];
};

export default function CodeBlockPre({ lines }: Props) {
  return (
    <pre className="bg-zinc-900">
      <CodeBlockCode lines={lines} />
    </pre>
  );
}
