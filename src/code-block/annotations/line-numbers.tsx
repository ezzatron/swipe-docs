import { AnnotationHandler, InnerLine } from "codehike/code";

export const lineNumbers: AnnotationHandler = {
  name: "lineNumbers",

  Line: (props) => {
    const { lineNumber, totalLines } = props;
    const width = totalLines.toString().length + 1;

    return (
      <div className="flex gap-3">
        <span style={{ minWidth: `${width}ch` }}>{lineNumber}</span>
        <InnerLine merge={props} />
      </div>
    );
  },
};
