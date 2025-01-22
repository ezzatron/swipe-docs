import { type Element, type Text } from "hast";
import { type AnnotationComment } from "./annotation.js";
import { type Mode } from "./mode.js";
export declare function cleanupLines(mode: Mode, lines: Element[], annotationComments: Map<Text, AnnotationComment>): void;
