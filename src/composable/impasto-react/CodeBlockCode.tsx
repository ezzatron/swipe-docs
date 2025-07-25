import { toJsxRuntime, type Components } from "hast-util-to-jsx-runtime";
import type { LineElement } from "impasto";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";

type Props = {
  lines: LineElement[];
  components?: Components;
  lineNumbers?: boolean;
};

export default function CodeBlockCode({
  lines,
  components,
  lineNumbers,
}: Props) {
  const content = toJsxRuntime(
    { type: "root", children: lines },
    { Fragment, jsx, jsxs, components },
  );

  // TODO: lineNumbers

  return (
    <pre>
      <code>{content}</code>
    </pre>
  );
}
