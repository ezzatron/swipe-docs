import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function CodeBlockFrame({ children }: Props) {
  return (
    <div className="not-prose my-6 overflow-clip rounded-sm bg-zinc-200 font-mono text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
      {children}
    </div>
  );
}
