import { allGuides } from "@/content";
import Link from "next/link";
import { useMemo } from "react";

export default function Docs() {
  const guides = useMemo(allGuides, []);

  return (
    <div>
      <h1>Docs</h1>

      <h2>How-to guides</h2>

      <ul>
        {guides.map(({ slug, href, summary, title }) => (
          <li key={slug}>
            <Link href={href}>
              <h3>{title}</h3>
              <p>{summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
