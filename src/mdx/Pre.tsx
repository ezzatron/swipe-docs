import { Children, type JSX, type ReactElement } from "react";
import CodeBlock from "../code/CodeBlock";

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

  return <CodeBlock {...codeProps} flag={flag} title={title} source={source} />;
}
