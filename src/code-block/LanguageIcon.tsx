import { JavascriptPlain, TypescriptPlain } from "devicons-react";
import { FileTextIcon, SquareTerminalIcon } from "lucide-react";

type Props = {
  lang: string;
};

export default function LanguageIcon({ lang }: Props) {
  if (lang === "javascript")
    return <JavascriptPlain size={16} color="currentcolor" />;
  if (lang === "typescript")
    return <TypescriptPlain size={16} color="currentcolor" />;

  return lang === "shellscript" ? (
    <SquareTerminalIcon size={16} />
  ) : (
    <FileTextIcon size={16} />
  );
}
