"use server";

import { createHighlighter } from "../code/loader/highlighter";
import { transform as staticTransform } from "../code/loader/transform";
import { transform as dynamicTransform } from "../code/transform";
import template from "./next.config.ts.hbr";
import type { Input, Output, State } from "./state";

export async function generateAction(
  _state: State,
  data: FormData,
): Promise<State> {
  const input: Input = {
    autoLinkHeadings: data.get("autoLinkHeadings") === "on",
    bundleAnalyzer: data.get("bundleAnalyzer") === "on",
    customDistDir: data.get("customDistDir") === "on",
    syntaxHighlighting: data.get("syntaxHighlighting") === "on",
    webpackLoader: data.get("webpackLoader") === "on",
  };

  return { input, output: await generateOutput(input) };
}

export async function generateOutput(input: Input): Promise<Output> {
  const highlighter = await createHighlighter();

  const scope = "source.ts";
  const rehypePlugins = input.autoLinkHeadings || input.syntaxHighlighting;
  const tree = dynamicTransform(
    staticTransform(
      highlighter.highlight(template({ ...input, rehypePlugins }), scope),
    ),
    { showLineNumbers: true },
  );

  return { scope, tree };
}
