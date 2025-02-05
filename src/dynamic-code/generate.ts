"use server";

import type { Root } from "hast";
import { createHighlighter } from "../code/loader/highlighter";
import { transform as staticTransform } from "../code/loader/transform";
import { transform as dynamicTransform } from "../code/transform";

export async function generateTree(name: string): Promise<Root> {
  const highlighter = await createHighlighter();

  return dynamicTransform(
    staticTransform(highlighter.highlight(generateSource(name), "source.ts")),
    { showLineNumbers: false },
  );
}

function generateSource(name: string): string {
  if (name.includes('"')) {
    return `console.log("Very sneaky! That's not going to work ;)");\n`;
  }

  return `console.log(${JSON.stringify(`Hello, ${name || "Anonymous"}!`)});\n`;
}
