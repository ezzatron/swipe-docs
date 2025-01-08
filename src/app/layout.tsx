import clsx from "clsx";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import RenderWhitespaceOnSelection from "../code/RenderWhitespaceOnSelection";
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
        "dark prose prose-invert mx-auto max-w-5xl bg-zinc-950 px-4 py-24",
        inter,
      )}
    >
      <body>{children}</body>
      <RenderWhitespaceOnSelection />
    </html>
  );
}

export const metadata = {
  title: "Swipe Docs",
  description:
    "A re-creation of the docs site of a very popular online payments service",
};
