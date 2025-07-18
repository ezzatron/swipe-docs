"use server";

import {
  createCoreTransform,
  createHighlighter,
  createInstanceTransform,
} from "impasto";
import all from "impasto/lang/all";
import { API_KEY_PATTERN } from "../code/api-key";
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
  const scope = "source.ts";
  const rehypePlugins = input.autoLinkHeadings || input.syntaxHighlighting;
  const source = template({ ...input, rehypePlugins });

  const highlighter = await createHighlighter(all);
  const baseTree = highlighter.highlight(source, scope);
  const coreTransform = createCoreTransform({
    redact: { "api-key": { search: [API_KEY_PATTERN] } },
  });
  coreTransform(baseTree);

  const instanceTransform = createInstanceTransform({ showLineNumbers: true });
  const tree = instanceTransform(baseTree);

  return { scope, tree };
}
