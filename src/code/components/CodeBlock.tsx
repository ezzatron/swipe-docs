import clsx from "clsx";
import type { Root } from "hast";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { cache, Fragment, type ReactNode } from "react";
import slugify from "react-slugify";
import { jsx, jsxs } from "react/jsx-runtime";
import { KEY_CLASS } from "../loader/class";
import { isCommandLine } from "../scope";
import { transform } from "../transform";
import APIKey from "./APIKey";
import styles from "./CodeBlock.module.css";
import CopyButton from "./CopyButton";
import LanguageIcon from "./LanguageIcon";
import PermalinkButton from "./PermalinkButton";

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
  tree: Root;
  scope: string | undefined;
  id?: string;
  title?: ReactNode;
  filename?: string;
  filenameContext?: number;
  lineNumbers?: boolean;
  section?: string;
  noSectionContext?: boolean;
};

export default function CodeBlock({
  tree,
  scope,
  id,
  title,
  filename,
  filenameContext = 1,
  lineNumbers = false,
  section,
  noSectionContext = false,
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
  if (title == null && isCommandLine(scope)) title = "Command Line";

  const transformed = transform(tree, {
    showLineNumbers: lineNumbers,
    section,
    noSectionContext,
  });
  const highlighted = toJsxRuntime(transformed, {
    Fragment,
    jsx,
    jsxs,
    components: {
      span: (props) => {
        switch (props.className) {
          case KEY_CLASS:
            return <APIKey />;
        }

        return <span {...props} />;
      },
    },
  });

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
          <CopyButton from={id} />
        </div>
      </div>

      <div className="not-prose">{highlighted}</div>
    </div>
  );
}
