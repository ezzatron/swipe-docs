import { LinkIcon } from "lucide-react";

type Props = {
  anchor: string;
};

export default function PermalinkButton({ anchor }: Props) {
  return (
    <a
      href={`#${encodeURIComponent(anchor)}`}
      aria-label="Link to code"
      title="Link to code"
      className="active:white text-inherit hover:text-gray-200 focus-visible:text-gray-200"
    >
      <LinkIcon size={16} />
    </a>
  );
}
