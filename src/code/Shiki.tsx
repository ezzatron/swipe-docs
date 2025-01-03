import clsx from "clsx";
import type { Root } from "hast";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";

type Props = {
  tree: Root;
};

export default function Shiki({ tree }: Props) {
  return toJsxRuntime(tree, {
    Fragment,
    jsx,
    jsxs,
    components: {
      pre: ({
        className,
        ...props
      }: { className: string } & Record<string, unknown>) => (
        <pre
          className={clsx(
            className,
            "mt-0 rounded-b rounded-t-none font-mono text-sm",
          )}
          {...props}
        />
      ),
    },
  });
}
