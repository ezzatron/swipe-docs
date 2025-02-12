import { cache, type ReactNode } from "react";
import slugify from "react-slugify";
import type { Props as BaseProps } from "./CodeBlockContent";
import CodeBlockContent from "./CodeBlockContent";
import CodeBlockContext from "./CodeBlockContext";

const createSlugify = cache(() => {
  const slugCounts: Record<string, number> = {};

  return (title: ReactNode): string => {
    const slug = slugify(title);
    const dashSlug = slug ? `-${slug}` : "";
    const count = slugCounts[slug] ?? 0;
    slugCounts[slug] = count + 1;

    return count > 0 ? `cb${dashSlug}-${count}` : `cb${dashSlug}`;
  };
});

type Props = Omit<BaseProps, "id"> & {
  id?: string;
};

export default function CodeBlockPreTransformed(props: Props) {
  let { id } = props;
  if (!id) id = createSlugify()(props.title);

  return (
    <CodeBlockContext id={id}>
      <CodeBlockContent {...props} id={id} />
    </CodeBlockContext>
  );
}
