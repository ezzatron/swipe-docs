import { transform } from "../transform";
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
  return (
    <CodeBlockPreTransformed
      {...props}
      tree={transform(tree, {
        showLineNumbers: lineNumbers,
        section,
        noSectionContext,
      })}
    />
  );
}
