import { cssClass } from "impasto";

export async function copyCode(container: HTMLElement): Promise<void> {
  const lineElements = container.getElementsByClassName(
    cssClass.line,
  ) as HTMLCollectionOf<HTMLElement>;
  const lines: string[] = [];

  for (const { innerText } of lineElements) {
    lines.push(innerText.replace(/\n$/, ""));
  }

  await navigator.clipboard.writeText(lines.join("\n"));
}
