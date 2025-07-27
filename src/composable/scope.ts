export function isCommandLine(scope: string | undefined): boolean {
  return scope === "source.shell" || scope === "text.shell-session";
}
