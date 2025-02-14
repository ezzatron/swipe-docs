/**
 * Returns a string where each interpolated value is URL encoded.
 */
export function u(
  strings: TemplateStringsArray,
  ...values: Parameters<typeof encodeURIComponent>[0][]
) {
  return strings.reduce((acc, str, index) => {
    return `${acc}${encodeURIComponent(values[index - 1])}${str}`;
  });
}
