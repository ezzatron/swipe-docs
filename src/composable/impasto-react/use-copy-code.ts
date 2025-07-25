"use client";

import { cssClass } from "impasto";
import { useCallback, useMemo, useRef, useState } from "react";
import type { CopyState } from "../impasto-react";
import { useCodeBlockRoot } from "./use-code-block-root";

export function useCopyCode(
  idleTimeout = 1200,
): [copy: () => void, copyState: CopyState] {
  const ref = useCodeBlockRoot();
  const [state, setState] = useState<CopyState>("idle");
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = useCallback(() => {
    (async () => {
      if (Number.isFinite(idleTimeout)) {
        clearTimeout(idleTimeoutRef.current);
        idleTimeoutRef.current = setTimeout(() => {
          setState("idle");
        }, idleTimeout);
      }

      const container = ref.current;

      if (!container) {
        setState("failed");

        return;
      }

      try {
        const lines = container.getElementsByClassName(
          cssClass.line,
        ) as HTMLCollectionOf<HTMLDivElement>;

        let text = "";
        for (let i = 0; i < lines.length; ++i) {
          if (lines[i].offsetParent != null) text += lines[i].innerText;
        }
        text = text.slice(0, -1);

        await navigator.clipboard.writeText(text);
        setState("copied");
      } catch {
        setState("failed");
      }
    })();
  }, [ref, idleTimeout]);

  return useMemo(() => [copy, state], [copy, state]);
}
