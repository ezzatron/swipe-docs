declare module "*?code" {
  import type { Root } from "hast";

  const result: {
    filename: string;
    scope: string | undefined;
    tree: Root;
    lineNumbers: true;
  };

  export = result;
}
