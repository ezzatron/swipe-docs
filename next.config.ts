import createMDX from "@next/mdx";
import {
  recmaCodeHike,
  remarkCodeHike,
  type CodeHikeConfig,
} from "codehike/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
};

const codeHikeConfig: CodeHikeConfig = {
  components: { code: "Code" },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [[remarkCodeHike, codeHikeConfig]],
    recmaPlugins: [[recmaCodeHike, codeHikeConfig]],
    jsx: true,
  },
});

export default withMDX(nextConfig);
