import { splitSection, type Root } from "impasto";
import { type ReactNode } from "react";
import CodeBlockActions from "./CodeblockActions";
import CodeBlockCopyButton from "./CodeBlockCopyButton";
import CodeBlockExpandButton from "./CodeBlockExpandButton";
import CodeBlockFrame from "./CodeBlockFrame";
import CodeBlockHeader from "./CodeblockHeader";
import CodeBlockPermalinkButton from "./CodeBlockPermalinkButton";
import CodeBlockPre from "./CodeBlockPre";
import CodeBlockTitle from "./CodeBlockTitle";
import { getTitleSlugger } from "./get-title-slugger";
import { limitFilePath } from "./impasto";
import { CodeBlockRoot } from "./impasto-react";

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
    <CodeBlockRoot>
      <CodeBlockFrame>
        <CodeBlockHeader>
          <CodeBlockTitle>{title}</CodeBlockTitle>

          <CodeBlockActions>
            <CodeBlockCopyButton />
            {id && <CodeBlockPermalinkButton anchor={id} />}
            <CodeBlockExpandButton title={title} lines={tree.children} />
          </CodeBlockActions>
        </CodeBlockHeader>

        <CodeBlockPre
          lines={result.content.lines}
          startLine={result.content.startLine}
          lineNumbers={lineNumbers}
        />
      </CodeBlockFrame>
    </CodeBlockRoot>
  );
}
