import { allDocs } from "content-collections";
import { useMemo } from "react";

export default function Docs() {
  const guides = useMemo((): typeof allDocs => {
    const guidesByKey: Record<string, (typeof allDocs)[number]> = {};

    for (const doc of allDocs) {
      if (doc.key) guidesByKey[doc.key] = doc;
    }

    return Object.values(guidesByKey);
  }, []);

  return (
    <div>
      <h1>Docs</h1>

      <h2>How-to guides</h2>

      <ul>
        {guides.map((guide) => (
          <li key={guide.key}>
            <a href={`/docs/compliance/guides/${guide.key}`}>
              <h3>{guide.title}</h3>
              <p>{guide.summary}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
