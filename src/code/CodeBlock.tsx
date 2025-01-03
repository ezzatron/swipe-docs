import type { Root } from "hast";
import CopyButton from "./CopyButton";
import LanguageIcon from "./LanguageIcon";
import Shiki from "./Shiki";

type Props = {
  lang: string;
  source: string;
  tree: Root;
  title?: string;
  filename?: string;
  filenameContext?: number;
};

export default function CodeBlock({
  lang,
  source,
  tree,
  title,
  filename,
  filenameContext = 1,
}: Props) {
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

      <Shiki tree={tree} />
    </div>
  );
}
