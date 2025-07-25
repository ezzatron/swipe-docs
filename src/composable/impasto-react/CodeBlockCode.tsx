import { toJsxRuntime, type Components } from "hast-util-to-jsx-runtime";
import type { LineElement } from "impasto";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";

type Props = {
  lines: LineElement[];
  components?: Components;
};

export default function CodeBlockCode({ lines, components }: Props) {
  return (
    <code>
      {toJsxRuntime(
        { type: "root", children: lines },
        { Fragment, jsx, jsxs, components },
      )}
    </code>
  );
}
