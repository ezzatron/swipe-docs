import Code from "./Code";
import { buildMeta, type Meta } from "./meta";

type Props = {
  children: string;
  lang?: string;
} & Partial<Meta>;

export default function CodeBlock({ children, lang = "text", ...meta }: Props) {
  return <Code codeblock={{ value: children, lang, meta: buildMeta(meta) }} />;
}
