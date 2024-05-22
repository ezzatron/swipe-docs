import { allDocs } from "content-collections";

export type Explainer = {
  href: string;
  title: string;
  summary: string;
};

export function allExplainers(): Explainer[] {
  return allDocs
    .filter(({ form }) => form === "explainer")
    .map(({ title, summary, _meta: { path } }) => {
      const segments = ["docs", ...path.split("/")];
      segments.pop(); // remove "/page"

      return {
        title,
        summary,
        href: "/" + segments.map((s) => encodeURIComponent(s)).join("/"),
      };
    });
}
