export type Meta = {
  title: string | undefined;
  lineNumbers: boolean;
  section: string | undefined;
};

export function parseMeta(meta: string): Meta {
  const queryIndex = meta.indexOf("?");
  const titlePart = queryIndex < 0 ? meta : meta.slice(0, queryIndex);
  const queryPart = queryIndex < 0 ? "" : meta.slice(queryIndex + 1);

  const title = decodeURIComponent(titlePart).trim() || undefined;

  const params = new URLSearchParams(queryPart);
  const lineNumbers = params.has("lineNumbers");
  const section = params.get("section") ?? undefined;

  return {
    title,
    lineNumbers,
    section,
  };
}

export function buildMeta({
  title = "",
  lineNumbers = false,
  section,
}: Partial<Meta>): string {
  const params = new URLSearchParams();
  if (lineNumbers) params.set("lineNumbers", "");
  if (section != null) params.set("section", section);

  return `${encodeURIComponent(title)}?${params.toString()}`;
}
