import type { MDXComponents } from "mdx/types";
import H1 from "./mdx/H1";
import Pre from "./mdx/Pre";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: H1,
    pre: Pre,
  };
}
