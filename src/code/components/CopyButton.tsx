"use client";

import { CheckIcon, CopyIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useId } from "../context";

export default function CopyButton() {
  const from = useId();
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    setIsHidden(false);
  }, []);

  const [state, setState] = useState<"IDLE" | "COPIED" | "FAILED">("IDLE");

  const handleClick = useCallback(async () => {
    const container = document.getElementById(from);

    if (!container) {
      setState("FAILED");

      return;
    }

    const lines = container.getElementsByClassName(
      "imp-l",
    ) as HTMLCollectionOf<HTMLDivElement>;

    let text = "";
    for (let i = 0; i < lines.length; ++i) {
      if (lines[i].offsetParent != null) text += lines[i].innerText;
    }
    text = text.slice(0, -1);

    try {
      await navigator.clipboard.writeText(text);
      setState("COPIED");
    } catch {
      setState("FAILED");
    }

    setTimeout(() => {
      setState("IDLE");
    }, 1200);
  }, [from]);

  return (
    <button
      aria-label="Copy code"
      title="Copy code"
      onClick={handleClick}
      className="cursor-pointer rounded-xs hover:text-gray-950 active:text-blue-500 dark:hover:text-gray-200 dark:active:text-blue-400"
      hidden={isHidden}
    >
      {state === "IDLE" ? <CopyIcon aria-hidden size={16} /> : undefined}
      {state === "COPIED" ? (
        <CheckIcon
          aria-hidden
          size={16}
          className="text-green-500 dark:text-green-400"
        />
      ) : undefined}
      {state === "FAILED" ? (
        <XIcon
          aria-hidden
          size={16}
          className="text-red-500 dark:text-red-400"
        />
      ) : undefined}
    </button>
  );
}
