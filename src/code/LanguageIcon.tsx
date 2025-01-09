import {
  JavascriptPlain,
  MarkdownOriginal,
  TypescriptPlain,
} from "devicons-react";
import { FileTextIcon, SquareTerminalIcon } from "lucide-react";

type Props = {
  lang: string;
};

export default function LanguageIcon({ lang }: Props) {
  switch (lang) {
    case "javascript":
    case "jsx":
      return <JavascriptPlain size={16} color="currentcolor" />;
    case "markdown":
    case "mdx":
      return <MarkdownOriginal size={16} fill="currentcolor" />;
    case "shellscript":
    case "shellsession":
      return <SquareTerminalIcon size={16} />;
    case "tsx":
    case "typescript":
      return <TypescriptPlain size={16} color="currentcolor" />;
  }

  return <FileTextIcon size={16} />;
}
