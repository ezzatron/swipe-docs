import { createCoreTransform, type AnnotationMode } from "impasto";
import { Children, type JSX, type ReactElement } from "react";
import { API_KEY_PATTERN } from "../code/api-key";
import CodeBlock from "../composable/CodeBlock";
import { createHighlighter } from "../composable/highlighter";

const LANGUAGE_PATTERN = /^language-(.+)$/;

type Props = JSX.IntrinsicElements["pre"] & {
  children: ReactElement<
    JSX.IntrinsicElements["code"] & { children: string; className: string }
  >;
  annotations?: AnnotationMode;
};

export default async function Pre({ children, title, annotations }: Props) {
  const { props } = Children.only(children);
  const { children: source, className, ...codeProps } = props;
  const match = className?.match(LANGUAGE_PATTERN);
  const flag = match?.[1];

  const highlighter = await createHighlighter();
  const scope = highlighter.flagToScope(flag);
  const tree = highlighter.highlight(source, scope);

  const coreTransform = createCoreTransform({
    annotationMode: annotations,
    redact: { "api-key": { search: [API_KEY_PATTERN] } },
  });
  const { tree: coreTree } = coreTransform(tree);

  return (
    <CodeBlock {...codeProps} tree={coreTree} scope={scope} title={title} />
  );
}
