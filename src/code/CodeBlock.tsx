import { type BundledLanguage, type SpecialLanguage } from "shiki";
import CopyButton from "./CopyButton";
import Highlight from "./Highlight";
import LanguageIcon from "./LanguageIcon";
import { normalizeLanguage } from "./shiki-language";

type Props = {
  lang?: BundledLanguage | SpecialLanguage;
  source: string;
  title?: string;
  filename?: string;
  filenameContext?: number;
};

export default function CodeBlock({
  lang: rawLang = "text",
  source: rawSource,
  title,
  filename,
  filenameContext = 1,
}: Props) {
  const source = rawSource.replace(/\n+$/, "");
  const lang = normalizeLanguage(rawLang);

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
        <CopyButton text={source} />
      </div>

      <Highlight lang={lang} source={source} />
    </div>
  );
}
