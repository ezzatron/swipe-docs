"use client";

import { useRef, type ComponentProps, type ReactNode } from "react";
import { context } from "./context";

type Props = ComponentProps<"div"> & {
  children: ReactNode;
};

export default function CodeBlockRoot({ children, ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <context.Provider value={{ ref }}>
      <div {...props} ref={ref}>
        {children}
      </div>
    </context.Provider>
  );
}
