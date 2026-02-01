import clsx from "clsx";
import type { Root } from "hast";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { dataAttribute } from "impasto";
import {
  Fragment,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { isCommandLine } from "../scope";
import APIKey from "./APIKey";
import CopyButton from "./CopyButton";
import LanguageIcon from "./LanguageIcon";
import PermalinkButton from "./PermalinkButton";
import SectionButton from "./SectionButton";
import SectionExpander from "./SectionExpander";

export type Props = {
  tree: Root;
  scope: string | undefined;
  id: string;
  title?: ReactNode;
  filename?: string;
  filenameContext?: number;
  className?: string;
  noMargin?: boolean;
  updating?: boolean;
};

export default function CodeBlockContent({
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

  if (title == null && isCommandLine(scope)) title = "Command Line";

  const firstChild = tree.children[0];
  const hasSection =
    firstChild.type === "element" &&
    firstChild.properties[dataAttribute.sectionName] != null;

  const highlighted = toJsxRuntime(tree, {
    development: false,
    Fragment,
    jsx,
    jsxDEV: undefined,
    jsxs,
    components: {
      span: (
        props: ComponentProps<"span"> & {
          [dataAttribute.redactionType]?: string;
        },
      ) => {
        if (props[dataAttribute.redactionType] === "api-key") return <APIKey />;
        return <span {...props} />;
      },
    },
  }) as ReactElement;

  return (
    <div
      id={id}
      className={clsx(
        className,
        "imp-frame overflow-clip rounded-sm font-mono text-sm",
      )}
    >
      <div className="flex gap-2 bg-gray-200 px-4 py-3 text-gray-600 sm:items-start dark:bg-gray-800 dark:text-gray-400">
        <div className="hidden sm:mt-0.5 sm:block">
          <LanguageIcon scope={scope} />
        </div>

        <div className="imp-title not-prose me-2 min-h-5 grow border-r border-gray-300 pe-4 dark:border-gray-700">
          {title}
        </div>

        <div className="flex items-center gap-3 sm:mt-0.5">
          <PermalinkButton anchor={id} />
          {hasSection && <SectionButton />}
          <CopyButton />
        </div>
      </div>

      <div
        className={clsx("not-prose", {
          "**:text-[var(--imp-line-number)]": updating,
        })}
      >
        {highlighted}
        {hasSection && <SectionExpander />}
      </div>
    </div>
  );
}
