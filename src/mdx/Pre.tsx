import { Children, type JSX, type ReactElement } from "react";
import CodeBlock from "../code/CodeBlock";
import { highlight } from "../code/highlight";

const LANGUAGE_PATTERN = /^language-(.+)$/;

type Props = JSX.IntrinsicElements["pre"] & {
  children: ReactElement<
    JSX.IntrinsicElements["code"] & { children: string; className: string }
  >;
};

export default function Pre({ children, title }: Props) {
  const { props } = Children.only(children);
  const { children: source, className, ...codeProps } = props;
  const match = className ? LANGUAGE_PATTERN.exec(className) : null;
  const flag = match?.[1];
  const [scope, tree] = highlight(flag, source);

  return <CodeBlock {...codeProps} tree={tree} scope={scope} title={title} />;
}
