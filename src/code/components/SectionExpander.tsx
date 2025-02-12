import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

export default function SectionExpander() {
  return (
    <label className="cb-se group has-focus-visible:focus-outline relative flex cursor-pointer justify-center rounded-b-sm border-t-1 border-dashed border-[var(--cb-context-border)] bg-[var(--cb-bg)] py-1 text-sm has-focus-visible:-outline-offset-2 sm:items-start">
      <input
        type="checkbox"
        className="absolute size-0 appearance-none focus-visible:outline-0"
      />

      <span aria-label="Show more" className="group-has-checked:hidden">
        <ChevronDownIcon size={16} aria-hidden />
      </span>

      <span aria-label="Show less" className="hidden group-has-checked:block">
        <ChevronUpIcon size={16} aria-hidden />
      </span>
    </label>
  );
}
