import Link from "next/link";
import { u } from "../u";

type Props = {
  id: string;
};

export default function CodeBlockPermalinkButton({ id }: Props) {
  return <Link href={u`#${id}`}>Permalink</Link>;
}
