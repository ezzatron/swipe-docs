import { type Element } from "hast";
import { type Annotation } from "./annotation.js";
import { type Mode } from "./mode.js";
export declare function addSections(mode: Mode, lines: Element[], annotations: Record<number, Annotation[]>): void;
