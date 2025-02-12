"use client";

import type { ReactNode } from "react";
import { Provider } from "../context";

type Props = {
  id: string;
  children: ReactNode;
};

export default function CodeBlockContext({ id, children }: Props) {
  return <Provider id={id}>{children}</Provider>;
}
