"use client";

import { useContext, type RefObject } from "react";
import { context } from "./context";

export function useCodeBlockRoot(): RefObject<HTMLElement | null> {
  return useContext(context).ref;
}
