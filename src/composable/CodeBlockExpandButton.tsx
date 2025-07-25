import { UnfoldVerticalIcon, XIcon } from "lucide-react";
import { Dialog } from "radix-ui";
import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  children: ReactNode;
};

export default function CodeBlockExpandButton({ title, children }: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <UnfoldVerticalIcon />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md p-[25px] shadow-[var(--shadow-6)] focus:outline-none">
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Close>
            <XIcon />
          </Dialog.Close>

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
