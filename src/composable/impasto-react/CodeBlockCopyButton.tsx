"use client";

import { Slot } from "@radix-ui/react-slot";
import { useEffect, useState, type ComponentProps } from "react";
import { useCopyCode } from "../impasto-react";

type Props = ComponentProps<"button"> & {
  asChild?: boolean;
  idleTimeout?: number;
};

export default function CodeBlockCopyButton({
  asChild,
  idleTimeout = 1200,
  ...props
}: Props) {
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
