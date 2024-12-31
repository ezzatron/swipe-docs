import { type LighterResult } from "@code-hike/lighter";
import Code from "./Code";
import { buildMeta, type Meta } from "./meta";

type Props = {
  children: string;
  lang?: LighterResult["lang"];
} & Partial<Meta>;

export default function CodeBlock({ children, lang = "txt", ...meta }: Props) {
  return <Code codeblock={{ value: children, lang, meta: buildMeta(meta) }} />;
}
