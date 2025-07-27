import { splitSection, type Root } from "impasto";
import { type ReactNode } from "react";
import CodeBlockActions from "./CodeblockActions";
import CodeBlockCopyButton from "./CodeBlockCopyButton";
import CodeBlockExpandButton from "./CodeBlockExpandButton";
import CodeBlockFrame from "./CodeBlockFrame";
import CodeBlockHeader from "./CodeblockHeader";
import CodeBlockLanguageIcon from "./CodeBlockLanguageIcon";
import CodeBlockPermalinkButton from "./CodeBlockPermalinkButton";
import CodeBlockPre from "./CodeBlockPre";
import CodeBlockTitle from "./CodeBlockTitle";
import { getTitleSlugger } from "./get-title-slugger";
import { limitFilePath } from "./impasto";
import { CodeBlockRoot } from "./impasto-react";
import { isCommandLine } from "./scope";

type Props = {
  tree: Root;
  scope: string | undefined;
  section?: string;
  id?: string;
  title?: ReactNode;
  filePath?: string;
  filePathContext?: number;
  noLineNumbers?: boolean;
  className?: string;
  updating?: boolean;
};

export default function CodeBlock({
  tree,
  scope,
  section,
  id,
  title,
  filePath,
  filePathContext,
  noLineNumbers,
}: Props) {
  if (!title) title = limitFilePath(filePath, filePathContext);
  if (!title && isCommandLine(scope)) title = "Command Line";
  if (!id) id = getTitleSlugger()(title, "cb");

  const result = splitSection(tree.children, section);
  const hasContext = result.contextBefore || result.contextAfter;

  return (
    <CodeBlockRoot>
      <CodeBlockFrame>
        <CodeBlockHeader>
          <CodeBlockLanguageIcon scope={scope} />
          <CodeBlockTitle>{title}</CodeBlockTitle>

          <CodeBlockActions>
            <CodeBlockCopyButton />
            {id && <CodeBlockPermalinkButton anchor={id} />}
            {hasContext && (
              <CodeBlockExpandButton title={title} lines={tree.children} />
            )}
          </CodeBlockActions>
        </CodeBlockHeader>

        <CodeBlockPre
          lines={result.content.lines}
          startLine={result.content.startLine}
          noLineNumbers={noLineNumbers}
        />
      </CodeBlockFrame>
    </CodeBlockRoot>
  );
}
