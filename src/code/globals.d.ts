/* eslint-disable no-var */
export {};

declare global {
  var highlighter:
    | ReturnType<typeof import("@wooorm/starry-night").createStarryNight>
    | undefined;
}
