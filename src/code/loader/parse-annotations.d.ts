import type { Element, Text } from "hast";
import { type Annotation, type AnnotationComment } from "./annotation.js";
import { type Mode } from "./mode.js";
export declare function parseAnnotations(mode: Mode, lines: Element[]): [
    annotations: Record<number, Annotation[]>,
    comments: Map<Text, AnnotationComment>
];
