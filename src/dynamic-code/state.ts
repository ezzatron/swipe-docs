import type { Root } from "hast";

export type Input = { name: string };
export type Output = { scope: string; tree: Root };
export type State = { input: Input; output: Output };
