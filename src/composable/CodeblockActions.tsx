import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function CodeBlockActions({ children }: Props) {
  return <div className="flex items-center gap-3">{children}</div>;
}
