import type { MDXComponents } from "mdx/types";
import Code from "./code-block/Code";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Code,
    h1: ({ children }) => (
      <h1 className="text-4xl font-extrabold tracking-tight">{children}</h1>
    ),
  };
}
