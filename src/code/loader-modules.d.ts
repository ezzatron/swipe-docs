declare module "*?code" {
  const result: {
    tree: import("hast").Root;
    scope: string | undefined;
    filename: string;
    lineNumbers: true;
  };

  export = result;
}
