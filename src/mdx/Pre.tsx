import { Children, type JSX, type ReactElement } from "react";
import CodeBlock from "../code/CodeBlock";
import { createHighlighter } from "../code/highlighter";

const LANGUAGE_PATTERN = /^language-(.+)$/;

type Props = JSX.IntrinsicElements["pre"] & {
  children: ReactElement<
    JSX.IntrinsicElements["code"] & { children: string; className: string }
  >;
};

export default async function Pre({ children, title }: Props) {
  const { props } = Children.only(children);
  const { children: source, className, ...codeProps } = props;
  const match = className ? LANGUAGE_PATTERN.exec(className) : null;
  const flag = match?.[1];

  const highlighter = await createHighlighter();
  const scope = flag && highlighter.flagToScope(flag);
  const tree = highlighter.highlight(source, scope);

  return <CodeBlock {...codeProps} tree={tree} scope={scope} title={title} />;
}
