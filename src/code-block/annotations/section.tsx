import { AnnotationHandler, InnerPre } from "codehike/code";

export function createSection(section: string | undefined): AnnotationHandler {
  return {
    name: "section",

    Block: ({ annotation: { query }, children }) => (
      <div data-section={query} data-section-match={query === section}>
        {children}
      </div>
    ),

    Pre: (props) => <InnerPre merge={props} data-show-section={section} />,
  };
}
