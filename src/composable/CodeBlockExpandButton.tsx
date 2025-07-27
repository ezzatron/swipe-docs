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
        <Dialog.Overlay className="fixed inset-0 flex items-center justify-center overflow-x-clip overflow-y-auto bg-black/70 px-8">
          <Dialog.Content
            aria-describedby=""
            className="max-h-full max-w-full shrink-1 shadow-[var(--shadow-6)] focus:outline-none"
          >
            <CodeBlockRoot className="py-8">
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
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
