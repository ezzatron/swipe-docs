"use client";

import { useActionState } from "react";
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
        <fieldset className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm/6 font-medium text-gray-900 dark:text-gray-100">
            Name
            <input
              name="name"
              defaultValue={state.input.name}
              onFocus={(event) => {
                queueMicrotask(() => {
                  event.target.select();
                });
              }}
              onChange={(event) => {
                event.target.form?.requestSubmit();
              }}
              placeholder="Who to greet"
              className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-800 dark:text-gray-100 dark:outline-gray-700 dark:focus:outline-blue-400"
            />
          </label>

          <button className="inline-flex grow basis-1/2 items-center justify-center gap-2 rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 active:bg-blue-700">
            Generate
          </button>
        </fieldset>
      </form>

      <CodeBlockPreTransformed
        scope="source.ts"
        tree={state.output.tree}
        title="Greeting code"
        className="not-prose min-w-0 grow"
        updating={isPending}
      />
    </div>
  );
}
