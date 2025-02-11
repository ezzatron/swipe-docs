import clsx from "clsx";
import type { Root } from "hast";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { cache, Fragment, type ReactNode } from "react";
import slugify from "react-slugify";
import { jsx, jsxs } from "react/jsx-runtime";
import { API_KEY_CLASS } from "../loader/class";
import { SECTION_DATA } from "../loader/data";
import { isCommandLine } from "../scope";
import APIKey from "./APIKey";
import CopyButton from "./CopyButton";
import LanguageIcon from "./LanguageIcon";
import PermalinkButton from "./PermalinkButton";
import SectionExpander from "./SectionExpander";

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

export type Props = {
  tree: Root;
  scope: string | undefined;
  id?: string;
  title?: ReactNode;
  filename?: string;
  filenameContext?: number;
  className?: string;
  noMargin?: boolean;
  updating?: boolean;
};

export default function CodeBlockPreTransformed({
  tree,
  scope,
  id,
  title,
  filename,
  filenameContext = 1,
  className,
  updating,
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

  const highlighted = toJsxRuntime(tree, {
    Fragment,
    jsx,
    jsxs,
    components: {
      pre: (props) => {
        const hasSection = props[SECTION_DATA] != null;

        return (
          <>
            <pre {...props} />
            {hasSection && <SectionExpander />}
          </>
        );
      },

      span: (props) => {
        switch (props.className) {
          case API_KEY_CLASS:
            return <APIKey />;
        }

        return <span {...props} />;
      },
    },
  });

  return (
    <div
      id={id}
      className={clsx(
        className,
        "cb-frame overflow-clip rounded-sm font-mono text-sm",
      )}
    >
      <div className="flex gap-2 bg-gray-200 px-4 py-3 text-gray-600 sm:items-start dark:bg-gray-800 dark:text-gray-400">
        <div className="hidden sm:mt-0.5 sm:block">
          <LanguageIcon scope={scope} />
        </div>

        <div className="cb-title not-prose me-2 min-h-5 grow border-r border-gray-300 pe-4 dark:border-gray-700">
          {title}
        </div>

        <div className="flex items-center gap-3 sm:mt-0.5">
          <PermalinkButton anchor={id} />
          <CopyButton from={id} />
        </div>
      </div>

      <div
        className={clsx("not-prose", {
          "**:text-[var(--cb-line-number)]": updating,
        })}
      >
        {highlighted}
      </div>
    </div>
  );
}
