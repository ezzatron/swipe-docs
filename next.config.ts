import bundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";
import type { Element } from "hast";
import { toString } from "hast-util-to-string";
import type { NextConfig } from "next";
import { createRequire } from "node:module";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import rehypeSlug from "rehype-slug";

const require = createRequire(import.meta.url);

const nextConfig: NextConfig = {
  distDir: "artifacts/next/dist",
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  webpack: (config) => {
    config.module.rules = [
      {
        oneOf: [
          {
            resourceQuery: /\bcode$/,
            use: require.resolve("./src/code/loader/loader.js"),
          },
          {
            resourceQuery: { not: [/\bcode$/] },
            rules: config.module.rules,
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
            class:
              "absolute top-[50%] -left-6 grid size-6 translate-y-[-50%] place-items-center",
          }),
          content: {
            type: "element",
            tagName: "svg",
            properties: {
              ariaHidden: true,
              viewBox: "0 0 24 24",
              class:
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
  },
});

export default withBundleAnalyzer(withMDX(nextConfig));

function withBundleAnalyzer(config: NextConfig): NextConfig {
  return process.env.ANALYZE === "true"
    ? bundleAnalyzer({ openAnalyzer: false })(config)
    : config;
}
