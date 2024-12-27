import { Pre, RawCode, highlight } from "codehike/code";
import { callout } from "./annotations/callout";

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark");

  return (
    <div className="mb-6 rounded border border-zinc-700">
      {highlighted.meta && (
        <div className="rounded-t border-b border-zinc-700 bg-zinc-900 px-3 py-2 text-sm">
          {highlighted.meta}
        </div>
      )}

      <Pre code={highlighted} handlers={[callout]} className="mb-0 mt-0" />
    </div>
  );
}
