"use client";

import { useEffect } from "react";
import { applyWhitespaceSelection } from "../impasto/apply-whitespace-selection";

export default function RenderWhitespaceOnSelection() {
  useEffect(() => {
    document.addEventListener("selectionchange", applyWhitespaceSelection);

    return () => {
      document.removeEventListener("selectionchange", applyWhitespaceSelection);
    };
  }, []);

  return null;
}
