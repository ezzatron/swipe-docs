import clsx from "clsx";
import type { Root } from "hast";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { cache, Fragment, type ReactNode } from "react";
import slugify from "react-slugify";
import { jsx, jsxs } from "react/jsx-runtime";
import styles from "./CodeBlock.module.css";
import CopyButton from "./CopyButton";
import { createHighlighter } from "./highlighter";
import LanguageIcon from "./LanguageIcon";
import PermalinkButton from "./PermalinkButton";
import { isCommandLine } from "./scope";
import { transform } from "./transform";

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

type Props = {
  source: string;
  flag: string | undefined;
  id?: string;
  title?: ReactNode;
  filename?: string;
  filenameContext?: number;
  lineNumbers?: boolean;
  section?: string;
  noSectionContext?: boolean;
  noAnnotations?: boolean;
};

export default async function CodeBlock({
  source,
  flag,
  id,
  title,
  filename,
  filenameContext = 1,
  lineNumbers = false,
  section,
  noSectionContext = false,
  noAnnotations = false,
}: Props) {
  if (title == null) {
    if (filename) {
      title =
        filenameContext < 1
          ? ""
          : filename.split("/").slice(-filenameContext).join("/");
    }
  }

  if (!id) id = createSlugify()(title);

  const highlighter = await createHighlighter();
  const scope = flag
    ? highlighter.flagToScope(flag)
    : filename
      ? highlighter.flagToScope(filename)
      : undefined;

  if (title == null && isCommandLine(scope)) title = "Command Line";

  const tree: Root = scope
    ? highlighter.highlight(source, scope)
    : { type: "root", children: [{ type: "text", value: source }] };
  const preId = `${id}-pre`;
  const transformed = transform(tree, {
    id: preId,
    lineNumbers,
    section,
    noSectionContext,
    noAnnotations,
  });
  const highlighted = toJsxRuntime(transformed, { Fragment, jsx, jsxs });

  return (
    <div id={id} className="my-6 overflow-clip rounded font-mono text-sm">
      <div className="flex gap-2 bg-gray-200 px-4 py-3 text-gray-600 sm:items-start dark:bg-gray-800 dark:text-gray-400">
        <div className="hidden sm:mt-0.5 sm:block">
          <LanguageIcon scope={scope} />
        </div>

        <div
          className={clsx(
            styles.title,
            "mr-2 min-h-5 flex-grow border-r border-gray-300 pr-4 dark:border-gray-700",
          )}
        >
          {title}
        </div>

        <div className="flex items-center gap-3 sm:mt-0.5">
          <PermalinkButton anchor={id} />
          <CopyButton from={preId} />
        </div>
      </div>

      <div className="not-prose">{highlighted}</div>
    </div>
  );
}
