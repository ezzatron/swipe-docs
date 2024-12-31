const DEFAULT_SHOW_LINE_NUMBERS = false;
const DEFAULT_START_LINE_NUMBER = 1;

export type Meta = {
  title: string | undefined;
  showLineNumbers: boolean;
  startLineNumber: number;
};

export function parseMeta(meta: string): Meta {
  const queryIndex = meta.indexOf("?");
  const titlePart = queryIndex < 0 ? meta : meta.slice(0, queryIndex);
  const queryPart = queryIndex < 0 ? "" : meta.slice(queryIndex + 1);
  const params = new URLSearchParams(queryPart);
  const showLineNumbersParam = params.get("line-numbers");
  const startLineNumberParam = params.get("start-line");

  const title = decodeURIComponent(titlePart).trim() || undefined;
  const showLineNumbers =
    typeof showLineNumbersParam === "string"
      ? showLineNumbersParam === "true"
      : DEFAULT_SHOW_LINE_NUMBERS;
  const startLineNumber =
    typeof startLineNumberParam === "string"
      ? parseInt(startLineNumberParam, 10)
      : DEFAULT_START_LINE_NUMBER;

  return {
    title,
    showLineNumbers,
    startLineNumber,
  };
}

export function buildMeta({
  title = "",
  showLineNumbers = DEFAULT_SHOW_LINE_NUMBERS,
  startLineNumber = DEFAULT_START_LINE_NUMBER,
}: Partial<Meta>): string {
  const params = new URLSearchParams([
    ["line-numbers", showLineNumbers.toString()],
    ["start-line", startLineNumber.toString()],
  ]);

  return `${encodeURIComponent(title)}?${params.toString()}`;
}
