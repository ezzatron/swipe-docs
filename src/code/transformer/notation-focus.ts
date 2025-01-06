import { createCommentNotationTransformer } from "@shikijs/transformers";

export const notationFocus = createCommentNotationTransformer(
  "notation-focus",
  new RegExp(
    `\\s*(?://|/\\*|<!--|#|--|%{1,2}|;{1,2}|"|')\\s+\\[!code focus(:\\d+)?\\]\\s*(?:\\*/|-->)?\\s*$`,
  ),
  function ([, range = ":1"], _line, _comment, lines, index) {
    const lineNum = Number.parseInt(range.slice(1), 10);

    for (const line of lines.slice(index + 1, index + lineNum + 1)) {
      this.addClassToHast(line, "focused");
    }

    this.addClassToHast(this.pre, "has-focused");

    return true;
  },
  true,
);
