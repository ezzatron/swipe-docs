"use client";

import { FoldVerticalIcon, UnfoldVerticalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useIsExpanded } from "../context";

export default function SectionButton() {
  const [isHidden, setIsHidden] = useState(true);
  const [isExpanded, setIsExpanded] = useIsExpanded();
  const label = isExpanded ? "Show less" : "Show more";

  useEffect(() => {
    setIsHidden(false);
  }, []);

  return (
    <button
      aria-label={label}
      title={label}
      onClick={() => {
        setIsExpanded((e) => !e);
      }}
      className="cursor-pointer rounded-xs hover:text-gray-950 active:text-blue-500 dark:hover:text-gray-200 dark:active:text-blue-400"
      hidden={isHidden}
    >
      {!isExpanded && <UnfoldVerticalIcon aria-hidden size={16} />}
      {isExpanded && <FoldVerticalIcon aria-hidden size={16} />}
    </button>
  );
}
