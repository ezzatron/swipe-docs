import rehypePrism from '@mapbox/rehype-prism'
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: [
    'js',
    'jsx',
    'mdx',
    'ts',
    'tsx',
  ],
}

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      rehypePrism,
    ],
  },
})

export default withMDX(nextConfig)
