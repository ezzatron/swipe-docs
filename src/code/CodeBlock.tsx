import { useId, type ReactNode } from "react";
import { type BundledLanguage, type SpecialLanguage } from "shiki";
import CopyButton from "./CopyButton";
import Highlight from "./Highlight";
import LanguageIcon from "./LanguageIcon";
import { extensionToLanguage, normalizeLanguage } from "./language";

type Props = {
  lang?: BundledLanguage | SpecialLanguage;
  source: string;
  title?: ReactNode;
  filename?: string;
  filenameContext?: number;
  section?: string;
};

export default function CodeBlock({
  lang,
  source,
  title,
  filename,
  filenameContext = 1,
  section,
}: Props) {
  const codeId = useId();

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
    <div>
      <div className="flex items-center gap-2 rounded-t bg-gray-900 px-4 py-3 font-mono text-sm text-gray-400">
        <div className="translate-y-[-1px]">
          <LanguageIcon lang={lang} />
        </div>

        <div className="flex-grow">{title}</div>
        <CopyButton from={codeId} />
      </div>

      <Highlight
        codeId={codeId}
        lang={lang}
        source={source}
        section={section}
      />
    </div>
  );
}
