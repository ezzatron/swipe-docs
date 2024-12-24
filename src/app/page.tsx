import { Inter } from "next/font/google";
import Content from "./message.mdx";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={inter.className}>
      <Content />
    </main>
  );
}
