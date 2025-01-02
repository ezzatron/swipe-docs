import {
  AnnotationHandler,
  InnerPre,
  type BlockAnnotation,
  type CodeAnnotation,
} from "codehike/code";
import {
  ArrowDownFromLineIcon,
  ArrowUpFromLineIcon,
  type LucideIcon,
} from "lucide-react";
import { Context, Trigger, Wrapper } from "../section";

export function createSection(
  totalLines: number,
  section: string | undefined,
): AnnotationHandler {
  return {
    name: "section",

    transform: (annotation: BlockAnnotation) => {
      if (section == null) return [annotation];

      const { fromLineNumber, toLineNumber } = annotation;
      const annotations: CodeAnnotation[] = [annotation];

      if (fromLineNumber > 1) {
        const endLineNumber = fromLineNumber - 1;

        annotations.push({
          name: "sectionBefore",
          query: "",
          fromLineNumber: 1,
          toLineNumber: endLineNumber,
        });
      }

      if (toLineNumber < totalLines) {
        const startLineNumber = toLineNumber + 1;

        annotations.push({
          name: "sectionAfter",
          query: "",
          fromLineNumber: startLineNumber,
          toLineNumber: totalLines,
        });
      }

      return annotations;
    },

    Pre: (props) =>
      section ? (
        <Wrapper>
          <InnerPre merge={props} data-section={section} />
        </Wrapper>
      ) : (
        <InnerPre merge={props} />
      ),
  };
}

export const sectionBefore: AnnotationHandler = {
  name: "sectionBefore",
  onlyIfAnnotated: true,

  Block: ({ children }) => (
    <>
      <Context>{children}</Context>
      <Trigger
        collapsed={
          <ContextButton icon={ArrowUpFromLineIcon} label="Show context" />
        }
        expanded={
          <ContextButton icon={ArrowDownFromLineIcon} label="Hide context" />
        }
      />
    </>
  ),
};

export const sectionAfter: AnnotationHandler = {
  name: "sectionAfter",
  onlyIfAnnotated: true,

  Block: ({ children }) => (
    <>
      <Trigger
        collapsed={
          <ContextButton icon={ArrowDownFromLineIcon} label="Show context" />
        }
        expanded={
          <ContextButton icon={ArrowUpFromLineIcon} label="Hide context" />
        }
      />
      <Context>{children}</Context>
    </>
  ),
};

function ContextButton({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <span className="inline-flex w-full items-center gap-2 text-zinc-500">
      <Icon size={16} />
      <span>{label}</span>
      <div className="border-t-1 border-dotted"></div>
    </span>
  );
}
