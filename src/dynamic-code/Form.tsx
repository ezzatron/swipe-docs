"use client";

import {
  useActionState,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
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
    "#next-mdx-config",
  );

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  return (
    <div className="not-prose flex flex-col gap-8 md:flex-row md:gap-6">
      <form action={action} className="flex flex-col gap-6 md:w-60">
        <h3 className="text-xl font-semibold text-[var(--tw-prose-headings)]">
          Next.js ⚡️ MDX
        </h3>

        <div className="flex flex-col gap-4">
          <Checkbox name="bundleAnalyzer" state={state} label="Bundle analysis">
            Add <InlineCode>@next/bundle-analyzer</InlineCode> and enable it via
            an environment variable.
          </Checkbox>

          <Checkbox name="customDistDir" state={state} label="Custom build dir">
            Output the Next.js build to a custom directory.
          </Checkbox>

          <Checkbox name="autoLinkHeadings" state={state} label="Heading links">
            Automatically add anchor links to headings based on their content.
          </Checkbox>

          <Checkbox
            name="syntaxHighlighting"
            state={state}
            label="Syntax highlighting"
          >
            Add <InlineCode>@wooorm/starry-night</InlineCode> for syntax
            highlighting support.
          </Checkbox>

          <Checkbox name="webpackLoader" state={state} label="Code loader">
            Add a custom webpack loader to load source from external files via{" "}
            <InlineCode>import</InlineCode> statements.
          </Checkbox>
        </div>

        {!isClientReady && (
          <div>
            <button className="rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 active:bg-blue-700 md:w-full">
              Generate config
            </button>
          </div>
        )}
      </form>

      <CodeBlockPreTransformed
        id="next-mdx-config"
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
  state,
  label,
  children,
}: {
  name: keyof Input;
  state: State;
  label: string;
  children: ReactNode;
}) {
  const descriptionId = useId();

  return (
    <div>
      <label className="group relative">
        <input
          type="checkbox"
          name={name}
          defaultChecked={state.input[name]}
          onChange={(event) => {
            event.target.form?.requestSubmit();
          }}
          aria-describedby={descriptionId}
          className="absolute size-0 appearance-none focus-visible:outline-0"
        />

        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="group-has-focus-visible:focus-outline relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out group-has-checked:bg-blue-600 dark:bg-gray-800"
          >
            <span className="pointer-events-none inline-block size-5 translate-x-0 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-has-checked:translate-x-5 dark:bg-gray-200" />
          </div>

          <span className="flex items-center gap-2 text-sm/6 font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
            {label}
          </span>
        </div>
      </label>

      <div
        id={descriptionId}
        className="mt-2 text-sm text-gray-500 dark:text-gray-400"
      >
        {children}
      </div>
    </div>
  );
}

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="text-xs text-[var(--tw-prose-body)]">{children}</code>
  );
}
