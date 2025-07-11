"use client";

import { useEffect } from "react";

export default function RenderWhitespaceOnSelection() {
  useEffect(() => {
    const handleSelection = () => {
      const whitespace = document.querySelectorAll(".imp-s, .imp-t");

      const selection = document.getSelection() ?? undefined;
      const range =
        !selection?.isCollapsed && selection?.rangeCount
          ? selection.getRangeAt(0)
          : undefined;

      for (const element of whitespace) {
        if (range?.intersectsNode(element)) {
          element.classList.add("selected");
        } else {
          element.classList.remove("selected");
        }
      }
    };

    document.addEventListener("selectionchange", handleSelection);

    return () => {
      document.removeEventListener("selectionchange", handleSelection);
    };
  }, []);

  return null;
}
