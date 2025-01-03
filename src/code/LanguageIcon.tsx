import { JavascriptPlain, TypescriptPlain } from "devicons-react";
import { FileTextIcon, SquareTerminalIcon } from "lucide-react";

type Props = {
  lang: string;
};

export default function LanguageIcon({ lang }: Props) {
  switch (lang) {
    case "javascript":
      return <JavascriptPlain size={16} color="currentcolor" />;
    case "typescript":
      return <TypescriptPlain size={16} color="currentcolor" />;
    case "shellscript":
    case "shellsession":
      return <SquareTerminalIcon size={16} />;
  }

  return <FileTextIcon size={16} />;
}
