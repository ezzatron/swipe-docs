import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { createRequire } from "node:module";
import rehypeMdxCodeProps from "rehype-mdx-code-props";

const require = createRequire(import.meta.url);

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  serverExternalPackages: ["@wooorm/starry-night"],
  webpack: (config) => {
    config.module.rules = [
      {
        oneOf: [
          {
            resourceQuery: /code/,
            use: require.resolve("./src/code/loader.js"),
          },
          {
            resourceQuery: { not: [/code/] },
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
