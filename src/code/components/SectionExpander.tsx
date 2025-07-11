"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { useId, useIsExpanded } from "../context";

export default function SectionExpander() {
  const id = useId();
  const [isExpanded, setIsExpanded] = useIsExpanded();
  const checkboxRef = useRef<HTMLInputElement>(null);

  const maintainScroll = useCallback(
    (fn: () => void) => {
      const line = document
        .getElementById(id)
        ?.querySelector(".imp-l.imp-sc") as HTMLElement | null;

      const before = line?.getBoundingClientRect().top ?? 0;
      fn();
      const after = line?.getBoundingClientRect().top ?? 0;
      const offset = after - before;

      if (!line || !offset) return;

      const parent = verticalScrollParent(line);
      if (parent) parent.scrollTop += offset;
    },
    [id],
  );

  useEffect(() => {
    if (!checkboxRef.current) return;

    const handleClick = (event: MouseEvent) => {
      event.preventDefault();

      // The .checked property is always true while the event is firing, so we
      // need to defer the logic to the next tick. A microtask doesn't work
      // either.
      setTimeout(() => {
        maintainScroll(() => {
          if (!checkboxRef.current) return;

          const nextIsExpanded = !checkboxRef.current.checked;
          checkboxRef.current.checked = nextIsExpanded;
          setIsExpanded(nextIsExpanded);
        });
      }, 0);
    };

    const checkbox = checkboxRef.current;
    checkbox.addEventListener("click", handleClick);

    return () => {
      checkbox.removeEventListener("click", handleClick);
    };
  }, [maintainScroll, setIsExpanded]);

  useEffect(() => {
    if (!checkboxRef.current) return;
    if (checkboxRef.current.checked === isExpanded) return;

    maintainScroll(() => {
      if (checkboxRef.current) checkboxRef.current.checked = isExpanded;
    });
  }, [maintainScroll, isExpanded]);

  return (
    <label className="imp-se group has-focus-visible:focus-outline relative block cursor-pointer justify-center rounded-b-sm border-t-1 border-dashed border-[var(--imp-context-border)] bg-[var(--imp-bg)] py-1 text-sm has-focus-visible:-outline-offset-2">
      <input
        ref={checkboxRef}
        type="checkbox"
        className="absolute size-0 appearance-none focus-visible:outline-0"
      />

      <div
        aria-label="Show more"
        title="Show more"
        className="flex justify-center group-has-checked:hidden"
      >
        <ChevronDownIcon size={16} aria-hidden />
      </div>

      <div
        aria-label="Show less"
        title="Show less"
        className="hidden justify-center group-has-checked:flex"
      >
        <ChevronUpIcon size={16} aria-hidden />
      </div>
    </label>
  );
}

function verticalScrollParent(element: Element): Element | null {
  let current = element.parentElement;

  while (current) {
    const overflow = window
      .getComputedStyle(current, null)
      .getPropertyValue("overflow-y");

    if (overflow === "auto" || overflow === "scroll") return current;

    current = current.parentElement;
  }

  return document.scrollingElement;
}
