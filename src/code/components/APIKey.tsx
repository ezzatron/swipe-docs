"use client";

import { useEffect, useRef, useState } from "react";

// TODO: Produce popup on click
export default function APIKey() {
  const ref = useRef<HTMLButtonElement>(null);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(false);
  }, []);

  const handleClick = async () => {
    if (!ref.current) return;

    try {
      await navigator.clipboard.writeText(ref.current.innerText);
    } catch {
      // TODO: Handle error
    }
  };

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      onClick={handleClick}
      className="-mx-1 rounded bg-blue-200 px-1 text-blue-950 enabled:hover:bg-blue-400 enabled:hover:text-white dark:bg-blue-900 dark:text-blue-100 enabled:dark:hover:bg-blue-700"
    >
      sk_test_006fdtrt32aTIPl7OaDEADC0DE
    </button>
  );
}
