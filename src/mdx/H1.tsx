import clsx from "clsx";
import type { JSX } from "react";

type Props = JSX.IntrinsicElements["h1"];

export default function H1({ className, ...props }: Props) {
  return (
    <h1
      {...props}
      className={clsx(className, "text-4xl font-extrabold tracking-tight")}
    />
  );
}
