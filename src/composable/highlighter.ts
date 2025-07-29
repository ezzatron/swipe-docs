import {
  type Highlighter,
  createHighlighter as createImpastoHighlighter,
} from "impasto";
import all from "impasto/lang/all";

declare global {
  var highlighter: Promise<Highlighter> | undefined;
}

export function createHighlighter(): Promise<Highlighter> {
  return (globalThis.highlighter ??= createImpastoHighlighter(all));
}
