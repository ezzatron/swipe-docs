import { transform } from "../transform";
import CodeBlockPreTransformed, {
  type Props as BaseProps,
} from "./CodeBlockPreTransformed";

type Props = BaseProps & {
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
