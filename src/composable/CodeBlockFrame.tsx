import clsx from "clsx";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  noMargin?: boolean;
};

export default function CodeBlockFrame({ children, noMargin = false }: Props) {
  return (
    <div
      className={clsx(
        "not-prose overflow-clip rounded-sm bg-zinc-200 font-mono text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
        { "my-6": !noMargin },
      )}
    >
      {children}
    </div>
  );
}
