import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  experimental: {
    mdxRs: true,
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);