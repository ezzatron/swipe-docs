import { withContentCollections } from "@content-collections/next";
import bundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";
import type { Element } from "hast";
import { toString } from "hast-util-to-string";
import all from "impasto/lang/all";
import type { NextConfig } from "next";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import type { Configuration, RuleSetRule } from "webpack";
import { API_KEY_PATTERN } from "./src/code/api-key";

const nextConfig: NextConfig = {
  distDir: "artifacts/next/dist",
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  serverExternalPackages: ["@wooorm/starry-night"],
  outputFileTracingIncludes: {
    "**": ["./node_modules/vscode-oniguruma/**"],
  },
  webpack: (config: Configuration) => {
    config.module ??= { rules: [] };
    const originalRules = (config.module.rules ?? []) as RuleSetRule[];

    config.module.rules = [
      {
        oneOf: [
          {
            resourceQuery: /\bcode$/,
            use: {
              loader: "impasto/loader",
              options: {
                grammars: all,
                redact: {
                  "api-key": {
                    search: [API_KEY_PATTERN.source],
                  },
                },
              },
            },
          },
          {
            resourceQuery: { not: [/\bcode$/] },
            rules: [
              ...originalRules,
              { test: /\.hbr$/, loader: "handlebars-loader" },
            ],
          },
        ],
      },
    ];

    return config;
  },
};

const withMDX = createMDX({
  options: {
    jsx: true,
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "after",
          group: {
            type: "element",
            tagName: "div",
            properties: {
              className: "heading-group group relative",
            },
            children: [],
          },
          properties: (heading: Element) => ({
            ariaLabel: `Permalink: ${toString(heading)}`,
            className:
              "absolute top-[50%] -left-6 grid size-6 translate-y-[-50%] place-items-center",
          }),
          content: {
            type: "element",
            tagName: "svg",
            properties: {
              ariaHidden: true,
              viewBox: "0 0 24 24",
              className:
                "size-4 text-transparent group-hover:text-inherit group-has-focus-visible:text-inherit",
            },
            children: [
              {
                type: "element",
                tagName: "use",
                properties: { href: "#link-icon-tpl" },
                children: [],
              },
            ],
          },
        },
      ],
      rehypeMdxCodeProps,
    ],
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  },
});

const createConfig = async () =>
  withBundleAnalyzer(await withContentCollections(withMDX(nextConfig)));

export default createConfig;

function withBundleAnalyzer(config: NextConfig): NextConfig {
  return process.env.ANALYZE === "true"
    ? bundleAnalyzer({ openAnalyzer: false })(config)
    : config;
}
