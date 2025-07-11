/**
 * Matches API keys.
 *
 * The pattern is:
 * - \b - word boundary
 * - sk_ - prefix
 * - (test_)? - optional test prefix
 * - [A-Fa-f0-9]{2} - hex key header
 * - [!-~]+ - key payload (printable ASCII, excluding space)
 * - [A-Fa-f0-9]{8} - hex checksum
 * - \b - word boundary
 */
export const API_KEY_PATTERN =
  /\bsk_(test_)?[A-Fa-f0-9]{2}[!-~]+[A-Fa-f0-9]{8}\b/g;
