import type { Root } from "impasto";

export type Input = {
  autoLinkHeadings: boolean;
  bundleAnalyzer: boolean;
  customDistDir: boolean;
  syntaxHighlighting: boolean;
  webpackLoader: boolean;
};

export type Output = {
  scope: string;
  tree: Root;
};

export type State = {
  input: Input;
  output: Output;
};
