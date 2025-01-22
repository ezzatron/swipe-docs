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
export const COMMENT_PATTERN = /^(\s*(?:\/\/|\/\*|<!--|#|--|%%?|;;?|"|')\s+)(.*?)\s*((?:\*\/|-->)\s*)?$/;
/**
 * Matches annotations.
 *
 * The pattern is:
 * - \s? - optional whitespace
 * - \[! - annotation start
 * - ([\w-]+) - annotation name
 * - (?:\s+(.+?))? - optional annotation value
 * - ] - annotation end
 * - \s? - optional whitespace
 */
export const ANNOTATION_PATTERN = /\s?\[!([\w-]+)(?:\s+(.+?))?]\s?/g;
/**
 * Splits on whitespace and retains the delimiters.
 *
 * The pattern is:
 * - (?=[ \t]) - positive lookahead for space or tab
 * - | - or
 * - (?<=[ \t]) - positive lookbehind for space or tab
 */
export const WHITESPACE_PATTERN = /(?=[ \t])|(?<=[ \t])/g;
//# sourceMappingURL=pattern.js.map