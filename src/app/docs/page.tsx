import { useMemo } from "react";
import LinkListItem from "./components/LinkListItem";
import { allExplainers } from "./explainers";
import { allGuides } from "./guides";

export default function Docs() {
  const explainers = useMemo(() => allExplainers(), []);
  const guides = useMemo(() => allGuides(), []);

  return (
    <div>
      <h1>Docs</h1>

      <h2>Learn</h2>

      <ul className="not-prose divide-y divide-gray-100 dark:divide-gray-800">
        {explainers.map(({ href, summary, title }) => (
          <LinkListItem
            key={href}
            href={href}
            title={title}
            summary={summary}
          />
        ))}
      </ul>

      <h2>How-to guides</h2>

      <ul className="not-prose divide-y divide-gray-100 dark:divide-gray-800">
        {guides.map(({ href, summary, title }) => (
          <LinkListItem
            key={href}
            href={href}
            title={title}
            summary={summary}
          />
        ))}
      </ul>
    </div>
  );
}
