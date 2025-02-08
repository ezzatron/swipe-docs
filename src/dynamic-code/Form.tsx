"use client";

import { useActionState, useEffect, useState } from "react";
import CodeBlockPreTransformed from "../code/components/CodeBlockPreTransformed";
import { generateAction } from "./generate";
import type { Input, State } from "./state";

type Props = {
  initialState: State;
};

export default function Form({ initialState }: Props) {
  const [isClientReady, setIsClientReady] = useState(false);
  const [state, action, isPending] = useActionState(
    generateAction,
    initialState,
  );

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  return (
    <div className="not-prose flex items-start gap-6">
      <form action={action}>
        <h3 className="mb-7 text-xl font-semibold text-[var(--tw-prose-headings)]">
          Next.js ⚡️ MDX
        </h3>

        <div className="mb-6 flex flex-col gap-3">
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

        {!isClientReady && (
          <button className="w-full rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 active:bg-blue-700">
            Generate
          </button>
        )}
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
  name: keyof Input;
  label: string;
  state: State;
}) {
  return (
    <label className="group relative">
      <input
        type="checkbox"
        name={name}
        defaultChecked={state.input[name]}
        onChange={(event) => {
          event.target.form?.requestSubmit();
        }}
        className="absolute size-0 focus-visible:outline-0"
      />

      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="group-has-focus-visible:focus-outline relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out group-has-checked:bg-blue-600 dark:bg-gray-800"
        >
          <span className="pointer-events-none inline-block size-5 translate-x-0 transform rounded-full bg-white ring-0 shadow transition duration-200 ease-in-out group-has-checked:translate-x-5 dark:bg-gray-200" />
        </div>

        <span className="flex items-center gap-2 text-sm/6 font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
          {label}
        </span>
      </div>
    </label>
  );
}
