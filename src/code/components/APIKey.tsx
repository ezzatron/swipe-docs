"use client";

import clsx from "clsx";
import { CheckIcon, CopyIcon, XIcon } from "lucide-react";
import { Popover } from "radix-ui";
import {
  useEffect,
  useRef,
  useState,
  type JSX,
  type ReactNode,
  type RefObject,
} from "react";

export default function APIKey() {
  const ref = useRef<HTMLButtonElement>(null);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(false);
  }, []);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          ref={ref}
          disabled={isDisabled}
          className="-mx-[0.2em] rounded-sm bg-blue-200 px-[0.2em] text-blue-950 enabled:hover:bg-blue-400 enabled:hover:text-white enabled:active:bg-blue-500 dark:bg-blue-900 dark:text-blue-100 dark:enabled:hover:bg-blue-700 dark:enabled:active:bg-blue-600"
        >
          sk_test_006fdtrt32aTIPl7OaDEADC0DE
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="top"
          sideOffset={4}
          className="mx-7 max-w-xs overflow-clip rounded-sm bg-gray-50 p-4 text-sm ring-1 shadow-2xl ring-gray-200 dark:bg-gray-950 dark:shadow-none dark:ring-gray-800"
        >
          <div className="mb-6">
            <p className="mt-0">
              This is a public sample test mode <APIKeyLink>API key</APIKeyLink>
              . Don&apos;t submit any personally identifiable information in
              requests made with this key.
            </p>

            <p>
              <APIKeyLink>Sign in</APIKeyLink> to see examples prefilled with
              your test keys.
            </p>
          </div>

          <div className="flex gap-3">
            <Popover.Close asChild>
              <APIKeyButton className="bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-700">
                OK
              </APIKeyButton>
            </Popover.Close>

            <APIKeyCopyButton from={ref} />
          </div>

          <Popover.Arrow className="fill-gray-50 dark:fill-gray-950" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function APIKeyLink({ children }: { children: ReactNode }) {
  return (
    <a href="#" className="font-bold underline">
      {children}
    </a>
  );
}

function APIKeyButton({
  className,
  icon,
  children,
  ...props
}: {
  className?: string;
  icon?: ReactNode;
  children: ReactNode;
} & JSX.IntrinsicElements["button"]) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex grow basis-1/2 items-center justify-center gap-2 rounded-md px-2.5 py-1.5 font-semibold shadow-xs",
        className,
      )}
    >
      {children}
      <div className="mt-0.5">{icon}</div>
    </button>
  );
}

function APIKeyCopyButton({
  from,
}: {
  from: RefObject<HTMLButtonElement | null>;
}) {
  const [state, setState] = useState<"IDLE" | "COPIED" | "FAILED">("IDLE");

  const handleClick = async () => {
    if (!from.current) return;

    const text = from.current.innerText;

    try {
      await navigator.clipboard.writeText(text);
      setState("COPIED");
    } catch {
      setState("FAILED");
    }

    setTimeout(() => {
      setState("IDLE");
    }, 1200);
  };

  const icon = ((state) => {
    if (state === "COPIED") {
      return (
        <CheckIcon size={16} className="text-green-500 dark:text-green-400" />
      );
    }

    if (state === "FAILED") {
      return <XIcon size={16} className="text-red-500 dark:text-red-400" />;
    }

    return <CopyIcon size={16} />;
  })(state);

  return (
    <APIKeyButton
      onClick={handleClick}
      icon={icon}
      className="ring-1 ring-gray-200 ring-inset hover:bg-gray-200 active:bg-gray-300 dark:ring-gray-800 dark:hover:bg-gray-800 dark:active:bg-gray-900"
    >
      Copy
    </APIKeyButton>
  );
}
