import { FileTextIcon, SquareTerminalIcon } from "lucide-react";
import { isCommandLine } from "./scope";

type Props = {
  scope: string | undefined;
};

export default function LanguageIcon({ scope }: Props) {
  return isCommandLine(scope) ? (
    <SquareTerminalIcon size={16} />
  ) : (
    <FileTextIcon size={16} />
  );
}
