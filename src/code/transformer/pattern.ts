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
export const COMMENT_PATTERN =
  /^(\s*(?:\/\/|\/\*|<!--|#|--|%%?|;;?|"|')\s+)(.*?)\s*((?:\*\/|-->)\s*)?$/;

/**
 * Matches comment notations.
 *
 * The pattern is:
 * - \s? - optional whitespace
 * - \[! - notation start
 * - ([\w-]+) - notation name
 * - (?:\s+(.+?))? - optional notation params
 * - ] - notation end
 * - \s? - optional whitespace
 */
export const NOTATION_PATTERN = /\s?\[!([\w-]+)(?:\s+(.+?))?]\s?/g;

/**
 * Matches escaped comment notations.
 *
 * The pattern is:
 * - \[\\! - escaped notation start
 * - (.*?]) - escaped notation content
 */
export const ESCAPED_NOTATION_PATTERN = /\[\\!(.*?])/g;
