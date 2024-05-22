import type { SDKName } from "@/sdk";
import { allDocs } from "content-collections";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useMemo } from "react";

type Props = {
  params: {
    key: string;
  };
};

export default function GuideIndex({ params: { key } }: Props) {
  const guides = useMemo((): typeof allDocs => {
    const guides: typeof allDocs = [];
    for (const doc of allDocs) if (doc.key === key) guides.push(doc);

    return guides;
  }, [key]);

  if (guides.length < 1) return notFound();

  const { title } = guides[0];

  const sdkLabel = (sdk: SDKName | undefined) => {
    switch (sdk) {
      case "android":
        return " (Android SDK)";
      case "dotnet":
        return " (.NET SDK)";
      case "ios":
        return " (iOS SDK)";
      case "web":
        return " (Web SDK)";
    }

    return "";
  };

  return (
    <>
      <h1>{title}</h1>
      <p>
        <em>Select the guide for your Compliance SDK:</em>
      </p>

      <ul>
        {guides.map(({ key, sdk, title }) => (
          <li key={sdk}>
            <Link href={`/docs/compliance/${sdk}/guides/${key}`}>
              {title + sdkLabel(sdk)}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
