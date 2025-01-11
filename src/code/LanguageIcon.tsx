import { FileTextIcon, SquareTerminalIcon } from "lucide-react";

type Props = {
  lang: string;
};

export default function LanguageIcon({ lang }: Props) {
  switch (lang) {
    case "shellscript":
    case "shellsession":
      return <SquareTerminalIcon size={16} />;
  }

  return <FileTextIcon size={16} />;
}
