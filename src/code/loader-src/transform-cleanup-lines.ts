import { type Element, type Text } from "hast";
import { type AnnotationComment } from "./annotation.js";
import { isEmptyLine } from "./is-empty-line.js";
import { type Mode } from "./mode.js";
import { ANNOTATION_PATTERN } from "./pattern.js";

export function cleanupLines(
  mode: Mode,
  lines: Element[],
  annotationComments: Map<Text, AnnotationComment>,
): void {
  let isFollowingEmpty = false;

  for (let i = lines.length - 1; i >= 0; --i) {
    const line = lines[i];

    // strip annotations
    if (mode === "strip") {
      let wasCommentRemoved = false;

      for (let j = line.children.length - 1; j >= 0; --j) {
        const node = line.children[j];
        if (node.type !== "element") continue;
        const [text] = node.children;
        if (text?.type !== "text") continue;
        const comment = annotationComments.get(text);
        if (!comment) continue;

        const [start, , end = ""] = comment;
        const content = comment[1].replaceAll(ANNOTATION_PATTERN, " ").trim();

        if (content) {
          // comment still has content after stripping annotations
          text.value = `${start}${content}${end}`;
        } else {
          wasCommentRemoved = true;

          const prevSibling = line.children[j - 1];
          const prevText =
            prevSibling?.type === "element"
              ? prevSibling.children[0]
              : undefined;
          const nextSibling = line.children[j + 1];
          const nextText =
            nextSibling?.type === "element"
              ? nextSibling.children[0]
              : undefined;
          const isJSX =
            prevText?.type === "text" &&
            prevText.value === "{" &&
            nextText?.type === "text" &&
            nextText.value === "}";

          if (isJSX) {
            line.children.splice(j - 1, 3);
            j -= 2; // account for the two additional elements that were removed
          } else {
            line.children.splice(j, 1);
          }
        }
      }

      if (wasCommentRemoved && isEmptyLine(line)) {
        lines.splice(i, 1);
        continue;
      }
    }

    // strip trailing whitespace
    for (let j = line.children.length - 1; j >= 0; --j) {
      const node = line.children[j];
      if (node.type !== "text") break;

      const trimmed = node.value.trimEnd();

      if (!trimmed) {
        line.children.splice(j, 1);
        continue;
      }

      if (trimmed !== node.value) {
        node.value = trimmed;
        break;
      }
    }

    // trim/collapse empty lines
    const isEmpty = isEmptyLine(line);

    if (isEmpty && (isFollowingEmpty || i === 0 || i === lines.length - 1)) {
      lines.splice(i, 1);
    }

    isFollowingEmpty = isEmpty;
  }

  // strip leading empty line
  if (lines[0] && isEmptyLine(lines[0])) lines.shift();

  // ensure all remaining lines end with a newline
  for (let i = lines.length - 1; i >= 0; --i) {
    lines[i].children.push({ type: "text", value: "\n" });
  }
}
