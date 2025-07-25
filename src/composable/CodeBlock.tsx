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
    <CodeBlockRoot className="not-prose">
      <div className="header">
        <div className="title">{title}</div>
        <div className="actions">
          <CodeBlockCopyButton />
          <CodeBlockExpandButton title={title} lines={tree.children} />
          {id && <CodeBlockPermalinkButton id={id} />}
        </div>
      </div>

      <CodeBlockPre lines={result.content.lines} />
    </CodeBlockRoot>
  );
}
