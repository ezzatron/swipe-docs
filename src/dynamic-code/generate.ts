"use server";

import { createHighlighter } from "../code/loader/highlighter";
import { transform as staticTransform } from "../code/loader/transform";
import { transform as dynamicTransform } from "../code/transform";
import type { Input, Output, State } from "./state";

export async function generateAction(
  _state: State,
  data: FormData,
): Promise<State> {
  const name = data.get("name");
  if (typeof name !== "string") throw new Error("Invalid name");

  const input = { name };

  return { input, output: await generateOutput(input) };
}

export async function generateOutput(input: Input): Promise<Output> {
  const highlighter = await createHighlighter();

  const scope = "source.ts";
  const tree = await dynamicTransform(
    staticTransform(highlighter.highlight(generateSource(input), scope)),
    { showLineNumbers: false },
  );

  return { scope, tree };
}

function generateSource({ name }: Input): string {
  if (name.includes('"')) {
    return `console.log("Very sneaky! That's not going to work ;)");\n`;
  }

  return `console.log(${JSON.stringify(`Hello, ${name || "Anonymous"}!`)});\n`;
}
