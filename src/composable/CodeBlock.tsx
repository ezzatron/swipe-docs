import { splitSection, type Root } from "impasto";
import { CheckIcon, CopyIcon, XIcon } from "lucide-react";
import { cache, type ReactNode } from "react";
import CodeBlockCustomCopyButton from "./CodeBlockCustomCopyButton";
import CodeBlockExpandButton from "./CodeBlockExpandButton";
import CodeBlockPermalinkButton from "./CodeBlockPermalinkButton";
import { limitFilePath } from "./impasto";
import {
  CodeBlockCode,
  CodeBlockCopyButton,
  CodeBlockRoot,
  createTitleSlugger,
} from "./impasto-react";

const getTitleSlugger = cache(createTitleSlugger);

type Props = {
  tree: Root;
  scope: string | undefined;
  section?: string;
  id?: string;
  title?: ReactNode;
  filePath?: string;
  filePathContext?: number;
  className?: string;
  updating?: boolean;
};

export default function CodeBlock({
  tree,
  section,
  id,
  title,
  filePath,
  filePathContext,
}: Props) {
  if (!title) title = limitFilePath(filePath, filePathContext);
  if (!id) id = getTitleSlugger()(title);

  const result = splitSection(tree.children, section);

  return (
    <CodeBlockRoot>
      <div className="header">
        <div className="title">{title}</div>
        <div className="actions">
          <CodeBlockCopyButton className="group">
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
          </CodeBlockCopyButton>

          <CodeBlockCustomCopyButton />

          <CodeBlockExpandButton title={title}>
            <CodeBlockCode lines={tree.children} />
          </CodeBlockExpandButton>

          {id && <CodeBlockPermalinkButton id={id} />}
        </div>
      </div>

      <CodeBlockCode lines={result.content.lines} />
    </CodeBlockRoot>
  );
}
