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
            resourceQuery: /source/,
            use: require.resolve("./src/code/source-loader.js"),
          },
          {
            resourceQuery: { not: [/source/] },
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
