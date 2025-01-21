declare module "*?code" {
  const result: {
    filename: string;
    source: string;
    lineNumbers: true;
  };

  export = result;
}
