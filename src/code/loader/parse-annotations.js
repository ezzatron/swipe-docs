import { ANNOTATION_PATTERN } from "./pattern.js";
/**
 * Matches comments.
 *
 * The pattern is:
 * - (\s*(?:\/\/|\/\*|<!--|#|--|%%?|;;?|"|')) - comment start
 * - \s+ - whitespace
 * - (.*?) - comment content (non-greedy)
 * - \s* - optional whitespace
 * - ((?:\*\/|-->)\s*)? - optional comment end
 */
const COMMENT_PATTERN = /^(\s*(?:\/\/|\/\*|<!--|#|--|%%?|;;?|"|')\s+)(.*?)\s*((?:\*\/|-->)\s*)?$/;
export function parseAnnotations(mode, lines) {
    const annotations = {};
    const comments = new Map();
    if (mode === "ignore")
        return [annotations, comments];
    for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];
        annotations[i] = [];
        for (let j = 0; j < line.children.length; ++j) {
            const node = line.children[j];
            if (node.type !== "element" || node.children.length !== 1)
                continue;
            const [text] = node.children;
            if (text?.type !== "text")
                continue;
            const commentMatch = text.value.match(COMMENT_PATTERN);
            if (!commentMatch)
                continue;
            const annotationMatches = commentMatch[2].matchAll(ANNOTATION_PATTERN);
            if (!annotationMatches)
                continue;
            comments.set(text, commentMatch.slice(1));
            for (const [source, name, value] of annotationMatches) {
                annotations[i].push({ source, name, value });
            }
        }
    }
    return [annotations, comments];
}
//# sourceMappingURL=parse-annotations.js.map