import { createInstanceTransform } from "impasto";
import { type Props as BaseProps } from "./CodeBlockContent";
import CodeBlockPreTransformed from "./CodeBlockPreTransformed";

type Props = Omit<BaseProps, "id"> & {
  id?: string;
  lineNumbers?: boolean;
  section?: string;
  noSectionContext?: boolean;
};

export default function CodeBlock({
  tree,
  lineNumbers,
  section,
  noSectionContext,
  ...props
}: Props) {
  const instanceTransform = createInstanceTransform({
    showLineNumbers: lineNumbers,
    section,
    noSectionContext,
  });

  return <CodeBlockPreTransformed {...props} tree={instanceTransform(tree)} />;
}
