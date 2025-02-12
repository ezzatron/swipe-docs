import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type Context = {
  id: string;
  isExpanded: [boolean, Dispatch<SetStateAction<boolean>>];
};

const context = createContext<Context>({
  id: "",
  isExpanded: [false, () => {}],
});

type Props = {
  id: string;
  children: ReactNode;
};

export function Provider({ id, children }: Props) {
  const isExpanded = useState(false);

  return (
    <context.Provider value={{ id, isExpanded }}>{children}</context.Provider>
  );
}

export function useId(): string {
  return useContext(context).id;
}

export function useIsExpanded(): [boolean, Dispatch<SetStateAction<boolean>>] {
  return useContext(context).isExpanded;
}
