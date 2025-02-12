import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

export default function SectionExpander() {
  return (
    <label className="cb-se group has-focus-visible:focus-outline relative block cursor-pointer justify-center rounded-b-sm border-t-1 border-dashed border-[var(--cb-context-border)] bg-[var(--cb-bg)] py-1 text-sm has-focus-visible:-outline-offset-2">
      <input
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
