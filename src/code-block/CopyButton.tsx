"use client";

import { CheckIcon, CopyIcon, XIcon } from "lucide-react";
import { useCallback, useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"IDLE" | "COPIED" | "FAILED">("IDLE");

  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("COPIED");
    } catch {
      setState("FAILED");
    }

    setTimeout(() => {
      setState("IDLE");
    }, 1200);
  }, [text]);

  return (
    <button aria-label="Copy to clipboard" onClick={handleClick}>
      {state === "IDLE" ? <CopyIcon size={16} /> : undefined}
      {state === "COPIED" ? (
        <CheckIcon size={16} className="text-green-400" />
      ) : undefined}
      {state === "FAILED" ? (
        <XIcon size={16} className="text-red-400" />
      ) : undefined}
    </button>
  );
}
