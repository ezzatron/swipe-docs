import { cssClass } from "impasto";

export function applyWhitespaceSelection() {
  const whitespace = document.querySelectorAll(
    `.${cssClass.space}, .${cssClass.tab}`,
  );

  const selection = document.getSelection() ?? undefined;
  const range =
    !selection?.isCollapsed && selection?.rangeCount
      ? selection.getRangeAt(0)
      : undefined;

  for (const element of whitespace) {
    if (range?.intersectsNode(element)) {
      element.classList.add("selected");
    } else {
      element.classList.remove("selected");
    }
  }
}
