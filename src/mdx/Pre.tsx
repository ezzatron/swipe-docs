import { createHighlighter } from "@code-loader/highlighter";
import { transform } from "@code-loader/transform";
import { Children, type JSX, type ReactElement } from "react";
import CodeBlock from "../code/CodeBlock";

const LANGUAGE_PATTERN = /^language-(.+)$/;

type Props = JSX.IntrinsicElements["pre"] & {
  children: ReactElement<
    JSX.IntrinsicElements["code"] & { children: string; className: string }
  >;
  noAnnotations?: boolean;
};

export default async function Pre({
  children,
  title,
  noAnnotations = false,
}: Props) {
  const { props } = Children.only(children);
  const { children: source, className, ...codeProps } = props;
  const match = className ? LANGUAGE_PATTERN.exec(className) : null;
  const flag = match?.[1];

  const highlighter = await createHighlighter();
  const scope = highlighter.flagToScope(flag);
  const tree = transform(highlighter.highlight(source, scope), {
    noAnnotations,
  });

  return <CodeBlock {...codeProps} tree={tree} scope={scope} title={title} />;
}
