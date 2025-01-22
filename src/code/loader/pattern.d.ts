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
