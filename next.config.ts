import { withContentCollections } from "@content-collections/next";
import bundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";
import all from "impasto/lang/all";
import type { NextConfig } from "next";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { API_KEY_PATTERN } from "./src/code/api-key";

const nextConfig: NextConfig = {
  distDir: "artifacts/next/dist",
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  serverExternalPackages: ["@wooorm/starry-night"],
  outputFileTracingIncludes: {
    "**": ["./node_modules/vscode-oniguruma/**"],
  },
  webpack: (config) => {
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
              ...config.module.rules,
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
    rehypePlugins: [rehypeMdxCodeProps],
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  },
});

export default withBundleAnalyzer(withContentCollections(withMDX(nextConfig)));

function withBundleAnalyzer(config: NextConfig): NextConfig {
  return process.env.ANALYZE === "true"
    ? bundleAnalyzer({ openAnalyzer: false })(config)
    : config;
}
