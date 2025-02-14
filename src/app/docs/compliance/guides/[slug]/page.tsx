import { notFound } from "next/navigation";
import { useMemo } from "react";
import LinkList from "../../../components/LinkList";
import LinkListItem from "../../../components/LinkListItem";
import { sdkSpecificGuides } from "../../../guides";

type Params = {
  slug: string;
};

export function generateStaticParams(): Params[] {
  return sdkSpecificGuides().map(({ slug }) => ({ slug }));
}

type Props = {
  params: Params;
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
      <LinkList>
        {Object.entries(forSDK).map(
          ([sdk, { href, title: SDKTitle, summary: SDKSummary }]) => (
            <LinkListItem
              key={sdk}
              href={href}
              title={SDKTitle ?? `${title} (${sdk} SDK)`}
              summary={SDKSummary ?? summary}
            />
          ),
        )}
      </LinkList>
    </>
  );
}
