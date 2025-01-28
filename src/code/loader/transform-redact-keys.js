import { visit } from "unist-util-visit";
import { API_KEY_CLASS } from "./class.js";
/**
 * Matches API keys.
 *
 * The pattern is:
 * - \b - word boundary
 * - sk_ - prefix
 * - (test_)? - optional test prefix
 * - [A-Fa-f0-9]{2} - hex key header
 * - [!-~]+ - key payload (printable ASCII, excluding space)
 * - [A-Fa-f0-9]{8} - hex checksum
 * - \b - word boundary
 */
const API_KEY_PATTERN = /\bsk_(test_)?[A-Fa-f0-9]{2}[!-~]+[A-Fa-f0-9]{8}\b/g;
export function redactKeys(lines) {
    visit({ type: "root", children: lines }, "text", (node, index, parent) => {
        if (!parent || index == null)
            return;
        const nonKeys = [];
        let keyCount = 0;
        API_KEY_PATTERN.lastIndex = 0;
        let match = API_KEY_PATTERN.exec(node.value);
        let lastIndex = 0;
        while (match) {
            if (!match[1])
                throw new Error("Non-test API keys are forbidden");
            ++keyCount;
            nonKeys.push(node.value.slice(lastIndex, match.index));
            lastIndex = API_KEY_PATTERN.lastIndex;
            match = API_KEY_PATTERN.exec(node.value);
        }
        nonKeys.push(node.value.slice(lastIndex));
        const replacement = [];
        let i = 0;
        for (; i < keyCount; ++i) {
            if (nonKeys[i])
                replacement.push({ type: "text", value: nonKeys[i] });
            replacement.push({
                type: "element",
                tagName: "span",
                properties: { class: API_KEY_CLASS },
                children: [],
            });
        }
        if (nonKeys[i])
            replacement.push({ type: "text", value: nonKeys[i] });
        parent.children.splice(index, 1, ...replacement);
    }, true);
}
//# sourceMappingURL=transform-redact-keys.js.map