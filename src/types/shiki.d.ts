declare module "*&shiki" {
  import { Root } from "hast";
  const result: { lang: string; source: string; tree: Root; filename: string };
  export = result;
}
