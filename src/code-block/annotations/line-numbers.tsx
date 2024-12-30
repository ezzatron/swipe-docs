import { AnnotationHandler, InnerLine } from "codehike/code";

export function createLineNumbers(startLine: number = 1): AnnotationHandler {
  return {
    name: "line-numbers",
    Line: (props) => {
      const { lineNumber, totalLines } = props;
      const width = totalLines.toString().length + 1;

      return (
        <div className="flex gap-3">
          <span style={{ minWidth: `${width}ch` }}>
            {lineNumber + startLine - 1}
          </span>
          <InnerLine merge={props} />
        </div>
      );
    },
  };
}
