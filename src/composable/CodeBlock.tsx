import { createInstanceTransform, type Root } from "impasto";
import { CheckIcon, CopyIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { cache, useEffect, useState, type ReactNode } from "react";
import { limitFilePath } from "./impasto";
import {
  CodeBlockCode,
  CodeBlockRoot,
  CopyCodeButton,
  createTitleSlugger,
  useCopyCode,
} from "./impasto-react";

const getTitleSlugger = cache(createTitleSlugger);

type Props = {
  tree: Root;
  scope: string | undefined;
  section?: string;
  noSectionContext?: boolean;
  id?: string;
  title?: ReactNode;
  filePath?: string;
  filePathContext?: number;
  lineNumbers?: boolean;
  className?: string;
  updating?: boolean;
};

export default function CodeBlock({
  tree,
  section,
  noSectionContext,
  id,
  title,
  filePath,
  filePathContext,
  lineNumbers = false,
}: Props) {
  if (!title) title = limitFilePath(filePath, filePathContext);
  if (!id) id = getTitleSlugger()(title);

  const instanceTransform = createInstanceTransform({
    showLineNumbers: lineNumbers,
    section,
    noSectionContext,
  });

  return (
    <CodeBlockRoot>
      <div className="header">
        <div className="title">{title}</div>
        <div className="actions">
          <CopyCodeButton className="group">
            <CopyIcon
              aria-hidden
              size={16}
              className="hidden group-data-[copy-state=idle]:block"
            />
            <CheckIcon
              aria-hidden
              size={16}
              className="hidden text-green-500 group-data-[copy-state=copied]:block dark:text-green-400"
            />
            <XIcon
              aria-hidden
              size={16}
              className="hidden text-red-500 group-data-[copy-state=failed]:block dark:text-red-400"
            />
          </CopyCodeButton>

          <CustomCopyButton />

          <Expander tree={tree} />

          {/* Permalink */}

          {id && <Link href={`#${encodeURIComponent(id)}`}>Permalink</Link>}
        </div>
      </div>

      <CodeBlockCode tree={instanceTransform(tree)} />
    </CodeBlockRoot>
  );
}

function CustomCopyButton() {
  const [copy, state] = useCopyCode();
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    setIsHidden(false);
  }, []);

  return (
    <button
      aria-label="Copy code"
      title="Copy code"
      onClick={copy}
      className="cursor-pointer rounded-xs hover:text-gray-950 active:text-blue-500 dark:hover:text-gray-200 dark:active:text-blue-400"
      hidden={isHidden}
    >
      {state === "idle" ? <CopyIcon aria-hidden size={16} /> : undefined}
      {state === "copied" ? (
        <CheckIcon
          aria-hidden
          size={16}
          className="text-green-500 dark:text-green-400"
        />
      ) : undefined}
      {state === "failed" ? (
        <XIcon
          aria-hidden
          size={16}
          className="text-red-500 dark:text-red-400"
        />
      ) : undefined}
    </button>
  );
}

function Expander({ tree }: { tree: Root }) {
  const instanceTransform = createInstanceTransform({ showLineNumbers: true });

  return (
    <Dialog.Root>
      <Dialog.Trigger>Expand</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <CodeBlockCode tree={instanceTransform(tree)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
