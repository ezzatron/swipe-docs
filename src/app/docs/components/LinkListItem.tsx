import Link from "next/link";

type Props = {
  href: string;
  title: string;
  summary: string;
};

export default function LinkListItem({ href, title, summary }: Props) {
  return (
    <li key={href} className="py-5">
      <Link href={href}>
        <div className="font-bold">{title}</div>
        <div className="text-sm/6 text-gray-500 italic dark:text-gray-400">
          {summary}
        </div>
      </Link>
    </li>
  );
}
