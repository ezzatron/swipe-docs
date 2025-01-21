import { all, createStarryNight } from "@wooorm/starry-night";
export function createHighlighter() {
    if (!globalThis.highlighter) {
        globalThis.highlighter = createStarryNight(all).then((highlighter) => ({
            ...highlighter,
            // Add support for undefined flags
            flagToScope(flag) {
                return flag && highlighter.flagToScope(flag);
            },
            // Add support for undefined scopes
            highlight(value, scope) {
                return scope == null
                    ? { type: "root", children: [{ type: "text", value }] }
                    : highlighter.highlight(value, scope);
            },
        }));
    }
    return globalThis.highlighter;
}
//# sourceMappingURL=highlighter.js.map