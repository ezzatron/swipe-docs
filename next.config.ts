import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { createRequire } from "node:module";
import rehypeMdxCodeProps from "rehype-mdx-code-props";

const require = createRequire(import.meta.url);

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  webpack: (config) => {
    config.module.rules = [
      {
        oneOf: [
          {
            resourceQuery: /\bshiki\b/,
            use: require.resolve("./src/code/shiki-loader.js"),
          },
          {
            resourceQuery: /source/,
            type: "asset/source",
          },
          {
            resourceQuery: { not: [/(\bshiki\b|source)/] },
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
    rehypePlugins: [rehypeMdxCodeProps],
  },
});

export default withMDX(nextConfig);
