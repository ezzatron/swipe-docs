import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function CodeBlockHeader({ children }: Props) {
  return <div className="flex gap-2 px-4 py-3">{children}</div>;
}
