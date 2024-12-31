const DEFAULT_LINE_NUMBERS = false;

export type Meta = {
  title: string | undefined;
  lineNumbers: boolean;
};

export function parseMeta(meta: string): Meta {
  const queryIndex = meta.indexOf("?");
  const titlePart = queryIndex < 0 ? meta : meta.slice(0, queryIndex);
  const queryPart = queryIndex < 0 ? "" : meta.slice(queryIndex + 1);
  const params = new URLSearchParams(queryPart);
  const lineNumbersParam = params.get("lineNumbers");

  const title = decodeURIComponent(titlePart).trim() || undefined;
  const lineNumbers =
    typeof lineNumbersParam === "string"
      ? lineNumbersParam === "true"
      : DEFAULT_LINE_NUMBERS;

  return {
    title,
    lineNumbers,
  };
}

export function buildMeta({
  title = "",
  lineNumbers = DEFAULT_LINE_NUMBERS,
}: Partial<Meta>): string {
  const params = new URLSearchParams([["lineNumbers", String(lineNumbers)]]);

  return `${encodeURIComponent(title)}?${params.toString()}`;
}
