import type { Element } from "hast";

export function addStyle(element: Element, addition: string): Element {
  const { properties } = element;
  const { style } = properties;

  properties.style =
    typeof style === "string"
      ? [...style.split(";"), addition].join(";")
      : addition;

  return element;
}
