"use client";

import { createContext, type RefObject } from "react";

export const context = createContext<{
  ref: RefObject<HTMLElement | null>;
}>({
  ref: undefined as unknown as RefObject<HTMLElement | null>,
});
