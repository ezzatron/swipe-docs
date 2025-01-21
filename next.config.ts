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
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypeMdxCodeProps],
  },
});

export default withMDX(nextConfig);
