import { allExplainers } from "@/explainers";
import { allGuides } from "@/guides";
import Link from "next/link";
import { useMemo } from "react";

export default function Docs() {
  const explainers = useMemo(allExplainers, []);
  const guides = useMemo(allGuides, []);

  return (
    <div>
      <h1>Docs</h1>

      <h2>Learn</h2>

      <ul>
        {explainers.map(({ href, summary, title }) => (
          <li key={href}>
            <Link href={href}>
              <p>
                <strong>{title}</strong>
              </p>
              <p>{summary}</p>
            </Link>
          </li>
        ))}
      </ul>

      <h2>How-to guides</h2>

      <ul>
        {guides.map(({ href, summary, title }) => (
          <li key={href}>
            <Link href={href}>
              <p>
                <strong>{title}</strong>
              </p>
              <p>{summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
