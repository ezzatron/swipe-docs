import { JavascriptPlain, TypescriptPlain } from "devicons-react";
import { FileTextIcon } from "lucide-react";

type Props = {
  lang: string;
};

export default function LanguageIcon({ lang }: Props) {
  if (lang === "javascript")
    return <JavascriptPlain size={16} color="currentcolor" />;
  if (lang === "typescript")
    return <TypescriptPlain size={16} color="currentcolor" />;

  return <FileTextIcon size={16} />;
}
