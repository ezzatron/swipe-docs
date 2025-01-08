export default function sourceLoader(source) {
  return `export default ${JSON.stringify({
    filename: this.resourcePath,
    source,
    lineNumbers: true,
  })};`;
}
