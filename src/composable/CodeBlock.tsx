import { splitSection, type Root } from "impasto";
import { cache, type ReactNode } from "react";
import CodeBlockCopyButton from "./CodeBlockCopyButton";
import CodeBlockExpandButton from "./CodeBlockExpandButton";
import CodeBlockPermalinkButton from "./CodeBlockPermalinkButton";
import CodeBlockPre from "./CodeBlockPre";
import { limitFilePath } from "./impasto";
import { CodeBlockRoot, createTitleSlugger } from "./impasto-react";

const getTitleSlugger = cache(createTitleSlugger);

type Props = {
  tree: Root;
  scope: string | undefined;
  section?: string;
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
  id,
  title,
  filePath,
  filePathContext,
  lineNumbers,
}: Props) {
  if (!title) title = limitFilePath(filePath, filePathContext);
  if (!id) id = getTitleSlugger()(title);

  const result = splitSection(tree.children, section);

  return (
    <CodeBlockRoot className="not-prose my-6 overflow-clip rounded-sm bg-zinc-200 font-mono text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
      <div className="flex gap-2 px-4 py-3">
        <div className="mr-2 grow border-r border-zinc-300 pr-4 dark:border-zinc-700 [&_code]:rounded-sm [&_code]:bg-zinc-100 [&_code]:px-[.4em] [&_code]:py-[.2em] [&_code]:dark:bg-zinc-700">
          {title}
        </div>

        <div className="flex items-center gap-3">
          <CodeBlockCopyButton />
          {id && <CodeBlockPermalinkButton anchor={id} />}
          <CodeBlockExpandButton title={title} lines={tree.children} />
        </div>
      </div>

      <CodeBlockPre
        lines={result.content.lines}
        startLine={result.content.startLine}
        lineNumbers={lineNumbers}
      />
    </CodeBlockRoot>
  );
}
