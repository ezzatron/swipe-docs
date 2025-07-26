"use client";

import { useCallback, useContext, useMemo, useRef, useState } from "react";
import type { CopyState } from "../impasto-react";
import { context } from "./context";
import { copyCode } from "./copy-code";

export function useCopyCode(
  idleTimeout = 1200,
): [copy: () => void, copyState: CopyState] {
  const ref = useContext(context).ref;
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
        await copyCode(container);
        setState("copied");
      } catch {
        setState("failed");
      }
    })();
  }, [ref, idleTimeout]);

  return useMemo(() => [copy, state], [copy, state]);
}
