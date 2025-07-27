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

export default function CodeBlockAPIKey() {
  const ref = useRef<HTMLButtonElement>(null);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          ref={ref}
          disabled={!isClientReady}
          className="-mx-[0.2em] rounded-sm bg-blue-200 px-[0.2em] text-blue-950 enabled:hover:bg-blue-400 enabled:hover:text-white enabled:active:bg-blue-500 dark:bg-blue-900 dark:text-blue-100 dark:enabled:hover:bg-blue-700 dark:enabled:active:bg-blue-600"
        >
          sk_test_006fdtrt32aTIPl7OaDEADC0DE
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="top"
          sideOffset={4}
          className="z-99 mx-7 max-w-xs overflow-clip rounded-sm bg-zinc-50 p-4 text-sm shadow-2xl ring-1 ring-zinc-200 dark:bg-zinc-950 dark:shadow-none dark:ring-zinc-800"
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
              <APIKeyButton className="bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700">
                OK
              </APIKeyButton>
            </Popover.Close>

            <APIKeyCopyButton from={ref} />
          </div>

          <Popover.Arrow className="fill-zinc-50 dark:fill-zinc-950" />
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
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const handleClick = async () => {
    if (!from.current) return;

    const text = from.current.innerText;

    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }

    setTimeout(() => {
      setState("idle");
    }, 1200);
  };

  const icon = ((state) => {
    if (state === "copied") {
      return (
        <CheckIcon size={16} className="text-green-500 dark:text-green-400" />
      );
    }

    if (state === "failed") {
      return <XIcon size={16} className="text-red-500 dark:text-red-400" />;
    }

    return <CopyIcon size={16} />;
  })(state);

  return (
    <APIKeyButton
      onClick={handleClick}
      icon={icon}
      className="ring-1 ring-zinc-200 ring-inset hover:bg-zinc-200 active:bg-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-800 dark:active:bg-zinc-900"
    >
      Copy
    </APIKeyButton>
  );
}
