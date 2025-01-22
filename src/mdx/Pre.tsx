import { Children, type JSX, type ReactElement } from "react";
import CodeBlock from "../code/CodeBlock";
import { createHighlighter } from "../code/loader/highlighter";
import type { Mode } from "../code/loader/mode";
import { transform } from "../code/loader/transform";

const LANGUAGE_PATTERN = /^language-(.+)$/;

type Props = JSX.IntrinsicElements["pre"] & {
  children: ReactElement<
    JSX.IntrinsicElements["code"] & { children: string; className: string }
  >;
  annotations?: Mode;
};

export default async function Pre({ children, title, annotations }: Props) {
  const { props } = Children.only(children);
  const { children: source, className, ...codeProps } = props;
  const match = className?.match(LANGUAGE_PATTERN);
  const flag = match?.[1];

  const highlighter = await createHighlighter();
  const scope = highlighter.flagToScope(flag);
  const tree = transform(highlighter.highlight(source, scope), {
    mode: annotations,
  });

  return <CodeBlock {...codeProps} tree={tree} scope={scope} title={title} />;
}
