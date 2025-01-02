"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

const context = createContext<{
  id: string;
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}>({
  id: "",
  isExpanded: false,
  setIsExpanded: () => {},
});

export function Wrapper({ children }: { children: ReactNode }) {
  const id = useId();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <context.Provider
      value={useMemo(
        () => ({ id, isExpanded, setIsExpanded }),
        [id, isExpanded, setIsExpanded],
      )}
    >
      <div id={id}>{children}</div>
    </context.Provider>
  );
}

export function Trigger({
  collapsed,
  expanded,
}: {
  collapsed: ReactNode;
  expanded: ReactNode;
}) {
  const { isExpanded, setIsExpanded } = useContext(context);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((isExpanded) => !isExpanded);
  }, [setIsExpanded]);

  return (
    <button
      onClick={toggleExpanded}
      aria-expanded={isExpanded}
      className="w-full"
    >
      {isExpanded ? expanded : collapsed}
    </button>
  );
}

export function Context({ children }: { children: ReactNode }) {
  const { isExpanded } = useContext(context);

  return isExpanded ? children : null;
}
