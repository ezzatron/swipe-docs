"use client";

import { useEffect, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ClientOnly({ children }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? children : null;
}
