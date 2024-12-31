export type Meta = {
  title: string | undefined;
  lineNumbers: boolean;
};

export function parseMeta(meta: string): Meta {
  const queryIndex = meta.indexOf("?");
  const titlePart = queryIndex < 0 ? meta : meta.slice(0, queryIndex);
  const queryPart = queryIndex < 0 ? "" : meta.slice(queryIndex + 1);

  const title = decodeURIComponent(titlePart).trim() || undefined;

  const params = new URLSearchParams(queryPart);
  const lineNumbers = params.has("lineNumbers");

  return {
    title,
    lineNumbers,
  };
}

export function buildMeta({
  title = "",
  lineNumbers = false,
}: Partial<Meta>): string {
  const params = new URLSearchParams();
  if (lineNumbers) params.set("lineNumbers", "");

  return `${encodeURIComponent(title)}?${params.toString()}`;
}
