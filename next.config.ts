import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { createRequire } from "node:module";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import rehypeSlug from "rehype-slug";

const require = createRequire(import.meta.url);

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  serverExternalPackages: ["@wooorm/starry-night"],
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
          headingProperties: {
            className: "group relative",
          },
          properties: {
            ariaHidden: true,
            tabIndex: -1,
            class: "absolute top-[50%] -left-6 translate-y-[-50%] pe-2",
          },
          content: {
            type: "element",
            tagName: "svg",
            properties: {
              viewBox: "0 0 24 24",
              class: "size-4 text-transparent group-hover:text-inherit",
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

export default withMDX(nextConfig);
