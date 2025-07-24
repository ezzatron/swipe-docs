import type { Root } from "impasto";
import { cache, type ReactNode } from "react";
import { limitFilename } from "./impasto";
import { CodeBlockProvider, createTitleSlugger } from "./impasto-react";

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
  className?: string;
  updating?: boolean;
};

export default function CodeBlock({
  id,
  title,
  filePath,
  filePathContext,
}: Props) {
  if (!title) title = limitFilename(filePath, filePathContext);
  if (!id) id = getTitleSlugger()(title);

  return <CodeBlockProvider id={id}>TODO</CodeBlockProvider>;
}
