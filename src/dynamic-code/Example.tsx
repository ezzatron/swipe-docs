import Form from "./Form";
import { generateOutput } from "./generate";
import type { Input } from "./state";

const input: Input = {
  autoLinkHeadings: false,
  bundleAnalyzer: false,
  customDistDir: false,
  syntaxHighlighting: false,
  webpackLoader: false,
};

const output = await generateOutput(input);

export default async function Example() {
  return <Form initialState={{ input, output }} />;
}
