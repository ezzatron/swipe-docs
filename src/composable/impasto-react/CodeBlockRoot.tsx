"use client";

import { useRef, type ReactNode } from "react";
import { context } from "./context";

type Props = {
  id?: string;
  children: ReactNode;
};

export default function CodeBlockRoot({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <context.Provider value={{ ref }}>
      <div ref={ref}>{children}</div>
    </context.Provider>
  );
}
