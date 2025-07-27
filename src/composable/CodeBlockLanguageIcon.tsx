import { FileTextIcon, SquareTerminalIcon } from "lucide-react";
import { isCommandLine } from "./scope";

type Props = {
  scope: string | undefined;
};

export default function CodeBlockLanguageIcon({ scope }: Props) {
  return (
    <div className="mt-0.5 hidden sm:block" aria-hidden>
      {isCommandLine(scope) ? (
        <SquareTerminalIcon size={16} />
      ) : (
        <FileTextIcon size={16} />
      )}
    </div>
  );
}
