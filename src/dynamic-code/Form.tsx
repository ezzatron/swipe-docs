"use client";

import clsx from "clsx";
import { useActionState, useId, useState } from "react";
import CodeBlockPreTransformed from "../code/components/CodeBlockPreTransformed";
import { generateAction } from "./generate";
import type { State } from "./state";

type Props = {
  initialState: State;
};

export default function Form({ initialState }: Props) {
  const [state, action, isPending] = useActionState(
    generateAction,
    initialState,
  );

  return (
    <div className="flex items-start gap-6">
      <form action={action}>
        <h3 className="mt-0 mb-5">Next.js ⚡️ MDX</h3>

        <div className="flex flex-col gap-3">
          <Checkbox
            name="bundleAnalyzer"
            label="Analyze bundle"
            state={state}
          />
          <Checkbox
            name="customDistDir"
            label="Custom dist dir"
            state={state}
          />
          <Checkbox
            name="autoLinkHeadings"
            label="Heading links"
            state={state}
          />
          <Checkbox
            name="syntaxHighlighting"
            label="Syntax highlighting"
            state={state}
          />
          <Checkbox name="webpackLoader" label="Webpack loader" state={state} />
        </div>
      </form>

      <CodeBlockPreTransformed
        scope="source.ts"
        tree={state.output.tree}
        title="next.config.ts"
        className="not-prose min-w-0 grow"
        updating={isPending}
      />
    </div>
  );
}

function Checkbox({
  name,
  label,
  state,
}: {
  name: string;
  label: string;
  state: State;
}) {
  const labelId = useId();
  const [checked, setChecked] = useState(
    state.input[name as keyof State["input"]],
  );

  return (
    <div className="flex items-center gap-3">
      <input type="hidden" name={name} value={checked ? "on" : ""} />

      <button
        role="switch"
        onClick={() => {
          setChecked((c) => !c);
        }}
        aria-checked={checked}
        aria-labelledby={labelId}
        className={clsx(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
          checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-800",
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            "pointer-events-none inline-block size-5 translate-x-0 transform rounded-full bg-white ring-0 shadow transition duration-200 ease-in-out dark:bg-gray-200",
            { "translate-x-5": checked },
          )}
        ></span>
      </button>

      <label
        id={labelId}
        className="flex items-center gap-2 text-sm/6 font-medium whitespace-nowrap text-gray-900 dark:text-gray-100"
      >
        {label}
      </label>
    </div>
  );
}
