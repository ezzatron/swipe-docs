import { LinkIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  anchor: string;
};

export default function CodeBlockPermalinkButton({ anchor }: Props) {
  return (
    <Link
      href={`#${encodeURIComponent(anchor)}`}
      aria-label="Link to code"
      title="Link to code"
      className="inline-block rounded-xs text-inherit hover:text-zinc-950 active:text-blue-500 dark:hover:text-zinc-200 dark:active:text-blue-400"
    >
      <LinkIcon aria-hidden size={16} />
    </Link>
  );
}
