import { extname } from "node:path";

export default function sourceLoader(source) {
  return `export default ${JSON.stringify({
    filename: this.resourcePath,
    lang: extname(this.resourcePath).slice(1),
    source,
  })};`;
}
