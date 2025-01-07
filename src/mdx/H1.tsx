import type { JSX } from "react";

type Props = JSX.IntrinsicElements["h1"];

export default function H1({ children }: Props) {
  return <h1 className="text-4xl font-extrabold tracking-tight">{children}</h1>;
}
