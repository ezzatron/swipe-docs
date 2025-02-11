import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

export default function SectionExpander() {
  return (
    <label className="cb-se group has-focus-visible:focus-outline relative flex justify-center rounded-b-sm bg-gray-200 py-0.5 text-sm text-gray-600 has-focus-visible:-outline-offset-2 sm:items-start dark:bg-gray-800 dark:text-gray-400">
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
