import clsx from "clsx";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html
      lang="en"
      className={clsx(
        "dark bg-zinc-950 prose prose-invert mx-auto py-24 max-w-5xl px-4",
        inter,
      )}
    >
      <body>{children}</body>
    </html>
  );
}

export const metadata = {
  title: "Swipe Docs",
  description:
    "A re-creation of the docs site of a very popular online payments service",
};
