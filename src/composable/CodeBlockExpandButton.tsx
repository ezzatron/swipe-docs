import type { SplitSectionResult } from "impasto";
import { UnfoldVerticalIcon, XIcon } from "lucide-react";
import { Dialog } from "radix-ui";
import type { ReactNode } from "react";
import CodeBlockActions from "./CodeblockActions";
import CodeBlockCopyButton from "./CodeBlockCopyButton";
import CodeBlockFrame from "./CodeBlockFrame";
import CodeBlockHeader from "./CodeblockHeader";
import CodeBlockLanguageIcon from "./CodeBlockLanguageIcon";
import CodeBlockPre from "./CodeBlockPre";
import CodeBlockTitle from "./CodeBlockTitle";
import { CodeBlockRoot } from "./impasto-react";

type Props = {
  title: ReactNode;
  scope: string | undefined;
  splitResult: SplitSectionResult;
};

export default function CodeBlockExpandButton({
  title,
  scope,
  splitResult,
}: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label="Show more"
        title="Show more"
        className="cursor-pointer rounded-xs hover:text-zinc-950 active:text-blue-500 dark:hover:text-zinc-200 dark:active:text-blue-400"
      >
        <UnfoldVerticalIcon aria-hidden size={16} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content
          aria-describedby=""
          className="fixed top-1/2 left-1/2 max-h-[85vh] -translate-x-1/2 -translate-y-1/2 shadow-[var(--shadow-6)] focus:outline-none"
        >
          <CodeBlockRoot>
            <CodeBlockFrame>
              <CodeBlockHeader>
                <CodeBlockLanguageIcon scope={scope} />
                <Dialog.Title asChild>
                  <CodeBlockTitle>{title}</CodeBlockTitle>
                </Dialog.Title>

                <CodeBlockActions>
                  <CodeBlockCopyButton />

                  <Dialog.Close className="cursor-pointer rounded-xs hover:text-zinc-950 active:text-blue-500 dark:hover:text-zinc-200 dark:active:text-blue-400">
                    <XIcon aria-hidden size={16} />
                  </Dialog.Close>
                </CodeBlockActions>
              </CodeBlockHeader>

              <CodeBlockPre expanded splitResult={splitResult} />
            </CodeBlockFrame>
          </CodeBlockRoot>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
