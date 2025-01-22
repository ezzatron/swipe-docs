import type { Element, Text } from "hast";
import { type Annotation, type AnnotationComment } from "./annotation.js";
import { type Mode } from "./mode.js";
import { ANNOTATION_PATTERN, COMMENT_PATTERN } from "./pattern.js";

export function parseAnnotations(
  mode: Mode,
  lines: Element[],
): [
  annotations: Record<number, Annotation[]>,
  comments: Map<Text, AnnotationComment>,
] {
  const annotations: Record<number, Annotation[]> = {};
  const comments: Map<Text, [start: string, content: string, end: string]> =
    new Map();

  if (mode === "ignore") return [annotations, comments];

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    annotations[i] = [];

    for (let j = 0; j < line.children.length; ++j) {
      const node = line.children[j];
      if (node.type !== "element" || node.children.length !== 1) continue;
      const [text] = node.children;
      if (text?.type !== "text") continue;
      const commentMatch = text.value.match(COMMENT_PATTERN);
      if (!commentMatch) continue;
      const annotationMatches = commentMatch[2].matchAll(ANNOTATION_PATTERN);
      if (!annotationMatches) continue;

      comments.set(text, commentMatch.slice(1) as [string, string, string]);

      for (const [source, name, value] of annotationMatches) {
        annotations[i].push({ source, name, value });
      }
    }
  }

  return [annotations, comments];
}
