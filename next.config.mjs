import createMDX from "@next/mdx";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import rehypePrettyCode from "rehype-pretty-code";
import remarkCodeFile from "./src/remark-code-file.mjs";

const rootPath = join(dirname(fileURLToPath(import.meta.url)));

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
};

/** @type {import('rehype-pretty-code').Options} */
const rehypePrettyCodeOptions = {
  defaultLang: "plaintext",
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      [
        remarkCodeFile,
        {
          rootPath,
          // showLineNumbers: true,
          // stripIndent: true,
        },
      ],
    ],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },
});

export default withMDX(nextConfig);
