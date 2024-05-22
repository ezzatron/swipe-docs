import { sdkSpecificGuides } from "@/guides";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useMemo } from "react";

export function generateStaticParams() {
  return sdkSpecificGuides().map(({ slug }) => ({ slug }));
}

type Props = {
  params: {
    slug: string;
  };
};

export default function SDKSpecificGuideIndex({ params: { slug } }: Props) {
  const guide = useMemo(
    () => sdkSpecificGuides().find((g) => g.slug === slug),
    [slug],
  );

  if (!guide) return notFound();

  const { title, summary, forSDK } = guide;

  return (
    <>
      <h1>{title}</h1>
      <p>
        <em>{summary}</em>
      </p>

      <h2>For your SDK</h2>
      <p>Select the guide for your Compliance SDK:</p>
      <ul>
        {Object.entries(forSDK).map(
          ([sdk, { href, title: SDKTitle, summary: SDKSummary }]) => (
            <li key={sdk}>
              <Link href={href}>
                <p>
                  <strong>{SDKTitle ?? `${title} (${sdk} SDK)`}</strong>
                </p>
                <p>{SDKSummary ?? summary}</p>
              </Link>
            </li>
          ),
        )}
      </ul>
    </>
  );
}
