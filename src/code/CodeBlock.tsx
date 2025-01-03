import type { Root } from "hast";
import CopyButton from "./CopyButton";
import LanguageIcon from "./LanguageIcon";
import Shiki from "./Shiki";

type Props = {
  code: { lang: string; source: string; tree: Root };
  title?: string;
};

export default function CodeBlock(props: Props) {
  const { lang, source, tree } = props.code;
  const { title = lang === "shellscript" ? "Command Line" : "" } = props;

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
