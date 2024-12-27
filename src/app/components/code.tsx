import { Pre, RawCode, highlight } from "codehike/code";
import { callout } from "./annotations/callout";

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark");

  return (
    <div className="border border-zinc-700 mb-6 rounded">
      {highlighted.meta && (
        <div className="px-3 py-2 text-sm border-b border-zinc-700 bg-zinc-900 rounded-t">
          {highlighted.meta}
        </div>
      )}

      <Pre code={highlighted} handlers={[callout]} className="mt-0 mb-0" />
    </div>
  );
}
