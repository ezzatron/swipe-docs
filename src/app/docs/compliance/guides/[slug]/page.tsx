import { notFound } from "next/navigation";
import LinkList from "../../../components/LinkList";
import LinkListItem from "../../../components/LinkListItem";
import { sdkSpecificGuides } from "../../../guides";

// 404 if the name is not in our static list
export const dynamicParams = false;

type Params = {
  slug: string;
};

// These names are allowed (and pre-generated)
export function generateStaticParams(): Params[] {
  return sdkSpecificGuides().map(({ slug }) => ({ slug }));
}

type Props = {
  params: Promise<Params>;
};

export default async function SDKSpecificGuideIndex({ params }: Props) {
  const { slug } = await params;
  const guide = sdkSpecificGuides().find((g) => g.slug === slug);

  if (!guide) notFound();

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
