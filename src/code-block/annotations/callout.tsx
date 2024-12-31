import { AnnotationHandler, InlineAnnotation } from "codehike/code";

export const callout: AnnotationHandler = {
  name: "callout",

  transform: ({
    name,
    query,
    lineNumber,
    fromColumn,
    toColumn,
    data,
  }: InlineAnnotation) => ({
    name,
    query,
    fromLineNumber: lineNumber,
    toLineNumber: lineNumber,
    data: { ...data, column: (fromColumn + toColumn) / 2 },
  }),

  Block: ({
    annotation: {
      data: { column },
      query,
    },
    children,
  }) => (
    <>
      {children}

      <div
        style={{ minWidth: `${column + 4}ch` }}
        className="relative -ml-[1ch] mt-1 w-fit whitespace-break-spaces rounded border border-current bg-zinc-800 px-2"
      >
        <div
          style={{ left: `${column}ch` }}
          className="absolute -top-[1px] h-2 w-2 -translate-y-1/2 rotate-45 border-l border-t border-current bg-zinc-800"
        />
        {query}
      </div>
    </>
  ),
};
