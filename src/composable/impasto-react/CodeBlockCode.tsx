import { toJsxRuntime, type Components } from "hast-util-to-jsx-runtime";
import type { LineElement } from "impasto";
import type { ComponentProps } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";

type Props = ComponentProps<"code"> & {
  lines: LineElement[];
  components?: Components;
};

export default function CodeBlockCode({ lines, components, ...props }: Props) {
  return (
    <code {...props}>
      {toJsxRuntime(
        { type: "root", children: lines },
        { Fragment, jsx, jsxs, components },
      )}
    </code>
  );
}
