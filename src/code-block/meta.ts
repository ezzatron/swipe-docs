const DEFAULT_LINE_NUMBERS = false;
const DEFAULT_START_LINE = 1;

export type Meta = {
  title: string | undefined;
  lineNumbers: boolean;
  startLine: number;
};

export function parseMeta(meta: string): Meta {
  const queryIndex = meta.indexOf("?");
  const titlePart = queryIndex < 0 ? meta : meta.slice(0, queryIndex);
  const queryPart = queryIndex < 0 ? "" : meta.slice(queryIndex + 1);
  const params = new URLSearchParams(queryPart);
  const lineNumbersParam = params.get("lineNumbers");
  const startLineParam = params.get("startLine");

  const title = decodeURIComponent(titlePart).trim() || undefined;
  const lineNumbers =
    typeof lineNumbersParam === "string"
      ? lineNumbersParam === "true"
      : DEFAULT_LINE_NUMBERS;
  const startLine =
    typeof startLineParam === "string"
      ? parseInt(startLineParam, 10)
      : DEFAULT_START_LINE;

  return {
    title,
    lineNumbers,
    startLine,
  };
}

export function buildMeta({
  title = "",
  lineNumbers = DEFAULT_LINE_NUMBERS,
  startLine = DEFAULT_START_LINE,
}: Partial<Meta>): string {
  const params = new URLSearchParams([
    ["lineNumbers", String(lineNumbers)],
    ["startLine", String(startLine)],
  ]);

  return `${encodeURIComponent(title)}?${params.toString()}`;
}
