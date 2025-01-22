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
/**
 * Matches API keys.
 *
 * The pattern is:
 * - \b - word boundary
 * - sk_ - prefix
 * - (?:test_)? - optional test prefix
 * - [A-Fa-f0-9]{2} - hex key header
 * - [!-~]+ - key payload (printable ASCII, excluding space)
 * - [A-Fa-f0-9]{8} - hex checksum
 * - \b - word boundary
 */
export const API_KEY_PATTERN = /\bsk_(?:test_)?[A-Fa-f0-9]{2}[!-~]+[A-Fa-f0-9]{8}\b/g;
//# sourceMappingURL=pattern.js.map