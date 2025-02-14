import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function LinkList({ children }: Props) {
  return (
    <ul className="not-prose divide-y divide-gray-100 dark:divide-gray-800">
      {children}
    </ul>
  );
}
