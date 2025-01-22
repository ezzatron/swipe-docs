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
export declare const COMMENT_PATTERN: RegExp;
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
export declare const ANNOTATION_PATTERN: RegExp;
/**
 * Splits on whitespace and retains the delimiters.
 *
 * The pattern is:
 * - (?=[ \t]) - positive lookahead for space or tab
 * - | - or
 * - (?<=[ \t]) - positive lookbehind for space or tab
 */
export declare const WHITESPACE_PATTERN: RegExp;
