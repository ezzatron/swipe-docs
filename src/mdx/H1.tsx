import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function H1({ children }: Props) {
  return <h1 className="text-4xl font-extrabold tracking-tight">{children}</h1>;
}
