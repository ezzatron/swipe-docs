import type { Element } from "hast";

export function addStyle(element: Element, addition: string): Element {
  const { properties } = element;
  const { style } = properties;

  console.log("BEFORE", properties.style);

  properties.style =
    typeof style === "string"
      ? [...style.split(";"), addition].join(";")
      : addition;

  console.log("AFTER", properties.style);

  return element;
}
