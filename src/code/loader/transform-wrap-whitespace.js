import { visit } from "unist-util-visit";
import { SPACE_CLASS, TAB_CLASS } from "./class.js";
const WHITESPACE_PATTERN = /[ \t]/g;
const WHITESPACE_CLASS_MAP = {
    " ": SPACE_CLASS,
    "\t": TAB_CLASS,
};
export function wrapWhitespace(lines) {
    visit({ type: "root", children: lines }, "text", (node, index, parent) => {
        if (!parent || index == null)
            return;
        const whitespace = [];
        const nonWhitespace = [];
        WHITESPACE_PATTERN.lastIndex = 0;
        let match = WHITESPACE_PATTERN.exec(node.value);
        let lastIndex = 0;
        while (match) {
            whitespace.push(match[0]);
            nonWhitespace.push(node.value.slice(lastIndex, match.index));
            lastIndex = WHITESPACE_PATTERN.lastIndex;
            match = WHITESPACE_PATTERN.exec(node.value);
        }
        nonWhitespace.push(node.value.slice(lastIndex));
        const replacement = [];
        let i = 0;
        for (; i < whitespace.length; ++i) {
            if (nonWhitespace[i]) {
                replacement.push({ type: "text", value: nonWhitespace[i] });
            }
            replacement.push({
                type: "element",
                tagName: "span",
                properties: { class: WHITESPACE_CLASS_MAP[whitespace[i]] },
                children: [{ type: "text", value: whitespace[i] }],
            });
        }
        if (nonWhitespace[i]) {
            replacement.push({ type: "text", value: nonWhitespace[i] });
        }
        parent.children.splice(index, 1, ...replacement);
    }, true);
}
//# sourceMappingURL=transform-wrap-whitespace.js.map