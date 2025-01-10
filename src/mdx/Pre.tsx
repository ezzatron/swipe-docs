import { Children, type JSX, type ReactElement } from "react";
import CodeBlock from "../code/CodeBlock";
import type { Language } from "../code/shiki";

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
  const lang = match?.[1] as Language;

  return <CodeBlock {...codeProps} lang={lang} title={title} source={source} />;
}
