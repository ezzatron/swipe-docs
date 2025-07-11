declare module "*?code" {
  const code: import("./loader/loader.js").LoadedCode;
  export default code;
}

declare module "*&code" {
  const code: import("./loader/loader.js").LoadedCode;
  export default code;
}
