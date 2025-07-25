export function limitFilePath(
  filePath: string | undefined,
  segmentCount: number = 1,
): string | undefined {
  return !filePath || segmentCount < 1
    ? undefined
    : filePath.split("/").slice(-segmentCount).join("/");
}
