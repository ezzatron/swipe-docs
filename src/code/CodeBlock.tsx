import clsx from "clsx";
import { useId, type ReactNode } from "react";
import styles from "./CodeBlock.module.css";
import CopyButton from "./CopyButton";
import Highlight from "./Highlight";
import { extensionToLanguage, normalizeLanguage } from "./language";
import LanguageIcon from "./LanguageIcon";
import PermalinkButton from "./PermalinkButton";
import { type Language } from "./shiki";

type Props = {
  id?: string;
  lang?: Language;
  source: string;
  title?: ReactNode;
  filename?: string;
  filenameContext?: number;
  lineNumbers?: boolean;
  section?: string;
  sectionContext?: boolean;
};

export default function CodeBlock({
  id: explicitId,
  lang,
  source,
  title,
  filename,
  filenameContext = 1,
  lineNumbers = false,
  section,
  sectionContext = true,
}: Props) {
  const implicitId = useId();
  const id = explicitId ?? implicitId;
  const copyId = `${id}-copy`;
  const sectionId = `${id}-section`;

  if (lang == null) {
    if (filename == null) {
      lang = "text";
    } else {
      const ext = filename.split(".").slice(-1)[0];
      lang = extensionToLanguage(ext);
    }
  } else {
    lang = normalizeLanguage(lang);
  }

  if (title == null) {
    if (filename != null) {
      title =
        filenameContext < 1
          ? ""
          : filename.split("/").slice(-filenameContext).join("/");
    } else if (lang === "shellscript" || lang === "shellsession") {
      title = "Command Line";
    }
  }

  return (
    <div id={explicitId}>
      <div className="flex gap-2 rounded-t bg-gray-900 px-4 py-3 font-mono text-sm text-gray-400 sm:items-start">
        <div className="hidden sm:mt-0.5 sm:block">
          <LanguageIcon lang={lang} />
        </div>

        <div
          className={clsx(
            styles.title,
            "mr-2 min-h-5 flex-grow border-r border-gray-800",
          )}
        >
          {title}
        </div>

        <div className="flex gap-3 sm:mt-0.5">
          {explicitId && <PermalinkButton anchor={explicitId} />}
          <CopyButton from={copyId} />
        </div>
      </div>

      <Highlight
        copyId={copyId}
        lang={lang}
        source={source}
        lineNumbers={lineNumbers}
        section={section}
        sectionId={sectionId}
        sectionContext={sectionContext}
      />
    </div>
  );
}
