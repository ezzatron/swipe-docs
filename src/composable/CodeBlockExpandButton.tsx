import type { LineElement } from "impasto";
import { UnfoldVerticalIcon, XIcon } from "lucide-react";
import { Dialog } from "radix-ui";
import type { ReactNode } from "react";
import CodeBlockCopyButton from "./CodeBlockCopyButton";
import CodeBlockPre from "./CodeBlockPre";
import { CodeBlockRoot } from "./impasto-react";

type Props = {
  title: ReactNode;
  lines: LineElement[];
};

export default function CodeBlockExpandButton({ title, lines }: Props) {
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
        <Dialog.Content className="not-prose fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-zinc-800 p-[25px] shadow-[var(--shadow-6)] focus:outline-none">
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Close>
            <XIcon />
          </Dialog.Close>

          <CodeBlockRoot>
            <CodeBlockCopyButton />
            <CodeBlockPre lines={lines} noLineNumbers />
          </CodeBlockRoot>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
