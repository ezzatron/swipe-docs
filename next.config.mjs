import withMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true,
  },
  pageExtensions: [
    'js',
    'jsx',
    'mdx',
    'ts',
    'tsx',
  ],
};

export default withMDX()(nextConfig);
