import { Slot } from "@radix-ui/react-slot";
import { toJsxRuntime, type Components } from "hast-util-to-jsx-runtime";
import { cssClass, type Root } from "impasto";
import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
  type RefObject,
} from "react";
import slugify from "react-slugify";
import { jsx, jsxs } from "react/jsx-runtime";

const context = createContext<{
  ref: RefObject<HTMLElement | null>;
}>({
  ref: undefined as unknown as RefObject<HTMLElement | null>,
});

type Props = {
  id?: string;
  children: ReactNode;
};

export function CodeBlockRoot({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <context.Provider value={{ ref }}>
      <div ref={ref}>{children}</div>
    </context.Provider>
  );
}

export function useCodeBlockContainerRef(): RefObject<HTMLElement | null> {
  return useContext(context).ref;
}

export type CopyState = "idle" | "copied" | "failed";

export function useCopyCode(
  idleTimeout = 1200,
): [copy: () => void, copyState: CopyState] {
  const ref = useCodeBlockContainerRef();
  const [state, setState] = useState<CopyState>("idle");
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = useCallback(() => {
    (async () => {
      if (Number.isFinite(idleTimeout)) {
        clearTimeout(idleTimeoutRef.current);
        idleTimeoutRef.current = setTimeout(() => {
          setState("idle");
        }, idleTimeout);
      }

      const container = ref.current;

      if (!container) {
        setState("failed");

        return;
      }

      try {
        const lines = container.getElementsByClassName(
          cssClass.line,
        ) as HTMLCollectionOf<HTMLDivElement>;

        let text = "";
        for (let i = 0; i < lines.length; ++i) {
          if (lines[i].offsetParent != null) text += lines[i].innerText;
        }
        text = text.slice(0, -1);

        await navigator.clipboard.writeText(text);
        setState("copied");
      } catch {
        setState("failed");
      }
    })();
  }, [ref, idleTimeout]);

  return useMemo(() => [copy, state], [copy, state]);
}

export type TitleSlugger = (title: ReactNode) => string | undefined;

export function createTitleSlugger(prefix: string = ""): TitleSlugger {
  const usedSlugs: Record<string, boolean> = {};

  return (title) => {
    let slug = slugify(title);

    if (!slug) return undefined;

    if (prefix) slug = `${prefix}-${slug}`;

    const slugWithPrefix = slug;
    let count = 0;

    while (usedSlugs[slug]) slug = `${slugWithPrefix}-${++count}`;
    usedSlugs[slug] = true;

    return slug;
  };
}

type CopyCodeButtonProps = ComponentProps<"button"> & {
  asChild?: boolean;
  idleTimeout?: number;
};

export function CopyCodeButton({
  asChild,
  idleTimeout = 1200,
  ...props
}: CopyCodeButtonProps) {
  const [copy, state] = useCopyCode(idleTimeout);
  const [isHidden, setIsHidden] = useState(true);
  useEffect(() => {
    setIsHidden(false);
  }, []);
  const Comp = asChild ? Slot : "button";

  return (
    <Comp onClick={copy} data-copy-state={state} hidden={isHidden} {...props} />
  );
}

type RenderCodeProps = {
  tree: Root;
  components?: Components;
};

export function CodeBlockCode({ tree, components }: RenderCodeProps) {
  return toJsxRuntime(tree, { Fragment, jsx, jsxs, components });
}
