export function isEmptyLine(line) {
    for (const node of line.children) {
        if (node.type !== "text" || node.value.trim())
            return false;
    }
    return true;
}
//# sourceMappingURL=is-empty-line.js.map