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
      <Dialog.Trigger>
        <UnfoldVerticalIcon />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-zinc-800 p-[25px] shadow-[var(--shadow-6)] focus:outline-none">
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Close>
            <XIcon />
          </Dialog.Close>

          <CodeBlockRoot>
            <CodeBlockCopyButton />
            <CodeBlockPre lines={lines} lineNumbers />
          </CodeBlockRoot>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
