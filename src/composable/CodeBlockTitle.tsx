import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function CodeBlockTitle({ children }: Props) {
  return (
    <div className="mr-2 grow border-r border-zinc-300 pr-4 dark:border-zinc-700 [&_code]:rounded-sm [&_code]:bg-zinc-100 [&_code]:px-[.4em] [&_code]:py-[.2em] [&_code]:dark:bg-zinc-700">
      {children}
    </div>
  );
}
