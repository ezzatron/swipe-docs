"use client";

import { CheckIcon, CopyIcon, XIcon } from "lucide-react";
import { useCallback, useState } from "react";

type Props = {
  from: string;
};

export default function CopyButton({ from }: Props) {
  const [state, setState] = useState<"IDLE" | "COPIED" | "FAILED">("IDLE");

  const handleClick = useCallback(async () => {
    const text = document.getElementById(from)?.textContent;

    if (text == null) {
      setState("FAILED");
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setState("COPIED");
      } catch {
        setState("FAILED");
      }
    }

    setTimeout(() => {
      setState("IDLE");
    }, 1200);
  }, [from]);

  return (
    <button
      aria-label="Copy"
      title="Copy"
      onClick={handleClick}
      className="active:white hover:text-gray-200 focus-visible:text-gray-200"
    >
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
