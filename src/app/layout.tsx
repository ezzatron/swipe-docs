import type { ReactNode } from "react";
import "./globals.css";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export const metadata = {
  title: "Swipe Docs",
  description:
    "A re-creation of the docs site of a very popular online payments service",
};
