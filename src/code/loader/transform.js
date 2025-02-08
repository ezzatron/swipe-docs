import { CODE_BLOCK_CLASS, CODE_BLOCK_WRAPPER_CLASS, LINE_NUMBER_CLASS, LINE_NUMBERS_CLASS, SECTION_CONTENT_CLASS, } from "./class.js";
import { parseAnnotations } from "./parse-annotations.js";
import { splitLines } from "./split-lines.js";
import { addSections } from "./transform-add-sections.js";
import { cleanupLines } from "./transform-cleanup-lines.js";
import { redactKeys } from "./transform-redact-keys.js";
import { trimSectionLines } from "./transform-trim-section-lines.js";
import { wrapWhitespace } from "./transform-wrap-whitespace.js";
export function transform(tree, { mode = "strip" } = {}) {
    const lines = splitLines(tree);
    const [annotations, annotationComments] = parseAnnotations(mode, lines);
    addSections(mode, lines, annotations);
    cleanupLines(mode, lines, annotationComments);
    trimSectionLines(mode, lines);
    trimSectionLines(mode, lines.toReversed());
    redactKeys(lines);
    wrapWhitespace(lines);
    const pre = {
        type: "element",
        tagName: "pre",
        properties: { class: CODE_BLOCK_CLASS },
        children: [
            {
                type: "element",
                tagName: "div",
                properties: { class: CODE_BLOCK_WRAPPER_CLASS },
                children: [
                    {
                        type: "element",
                        tagName: "div",
                        properties: { class: SECTION_CONTENT_CLASS },
                        children: [
                            createLineNumbers(1, lines.length, lines.length),
                            {
                                type: "element",
                                tagName: "code",
                                properties: {},
                                children: lines,
                            },
                        ],
                    },
                ],
            },
        ],
    };
    return { type: "root", children: [pre] };
}
function createLineNumbers(start, count, totalLines) {
    const width = `${String(totalLines).length}ch`;
    const numbers = {
        type: "element",
        tagName: "div",
        properties: { class: LINE_NUMBERS_CLASS, style: `--cb-w: ${width}` },
        children: [],
    };
    for (let i = 0; i < count; ++i) {
        numbers.children.push({
            type: "element",
            tagName: "div",
            properties: { class: LINE_NUMBER_CLASS },
            children: [{ type: "text", value: String(start + i) }],
        });
    }
    return numbers;
}
//# sourceMappingURL=transform.js.map