/* eslint-disable no-var */
export {};

declare global {
  var highlighter:
    | Promise<
        Awaited<
          ReturnType<typeof import("@wooorm/starry-night").createStarryNight>
        > & {
          flagToScope: (flag: string | undefined) => string | undefined;

          highlight: (
            value: string,
            scope: string | undefined,
          ) => typeof import("hast").Root;
        }
      >
    | undefined;
}
