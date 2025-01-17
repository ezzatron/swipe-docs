export default function codeLoader(source) {
  const result = {
    filename: this.resourcePath,
    source,
    lineNumbers: true,
  };

  return `export default ${JSON.stringify(result)};`;
}
