export function limitFilename(
  filename: string | undefined,
  segmentCount: number = 1,
): string | undefined {
  return !filename || segmentCount < 1
    ? undefined
    : filename.split("/").slice(-segmentCount).join("/");
}
