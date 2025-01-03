import { codeToHast, type BundledLanguage, type SpecialLanguage } from "shiki";
import CodeBlock from "./CodeBlock";
import { normalizeLanguage } from "./shiki-language";
import { shikiOptions } from "./shiki-options";

type Props = {
  source: string;
  lang?: BundledLanguage | SpecialLanguage;
  title?: string;
};

export default async function StringCodeBlock({
  source,
  lang = "text",
  title,
}: Props) {
  lang = normalizeLanguage(lang);
  const tree = await codeToHast(source, { ...shikiOptions, lang });

  return <CodeBlock code={{ lang, source, tree }} title={title} />;
}
