import { allDocs } from "content-collections";

export default function Docs() {
  return (
    <div>
      <h1>Docs</h1>

      <ul>
        {allDocs.map((doc) => (
          <li key={doc._meta.path}>
            <a href={`/docs/${doc._meta.path}`}>
              <h3>{doc.title}</h3>
              <p>{doc.summary}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
