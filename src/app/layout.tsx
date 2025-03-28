import clsx from "clsx";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import RenderWhitespaceOnSelection from "../code/components/RenderWhitespaceOnSelection";
import LinkIconTemplate from "../components/LinkIconTemplate";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html
      lang="en"
      className={clsx(
        "prose dark:prose-invert mx-auto max-w-4xl bg-zinc-50 px-8 py-24 dark:bg-zinc-950",
        inter,
      )}
    >
      <body>
        <LinkIconTemplate />

        {children}
      </body>
      <RenderWhitespaceOnSelection />
    </html>
  );
}

export const metadata = {
  title: "Swipe Docs",
  description:
    "A re-creation of the docs site of a very popular online payments service",
};
