"use client";

import { CheckIcon, CopyIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useCopyCode } from "./impasto-react";

export default function CodeBlockCustomCopyButton() {
  const [copy, state] = useCopyCode();
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    setIsHidden(false);
  }, []);

  return (
    <button
      aria-label="Copy code"
      title="Copy code"
      onClick={copy}
      className="cursor-pointer rounded-xs hover:text-gray-950 active:text-blue-500 dark:hover:text-gray-200 dark:active:text-blue-400"
      hidden={isHidden}
    >
      {state === "idle" ? <CopyIcon aria-hidden size={16} /> : undefined}
      {state === "copied" ? (
        <CheckIcon
          aria-hidden
          size={16}
          className="text-green-500 dark:text-green-400"
        />
      ) : undefined}
      {state === "failed" ? (
        <XIcon
          aria-hidden
          size={16}
          className="text-red-500 dark:text-red-400"
        />
      ) : undefined}
    </button>
  );
}
