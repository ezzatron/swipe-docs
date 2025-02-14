import { allDocs } from "content-collections";
import type { SDKName } from "../../../content-collections";
import { u } from "../../u";

export type Guide = {
  slug: string;
  href: string;
  title: string;
  summary: string;
  forSDK?: Partial<
    Record<
      SDKName,
      {
        href: string;
        title?: string;
        summary?: string;
      }
    >
  >;
};

export function allGuides(): Guide[] {
  const bySlug = new Map<string, Guide>();

  for (const doc of allDocs) {
    const { form, title, summary, slug, sdk } = doc;

    if (form !== "guide" || !slug) continue;

    let guide = bySlug.get(slug);

    if (!guide) {
      guide = {
        title,
        summary,
        slug,
        href: u`/docs/compliance/guides/${slug}`,
      };
      bySlug.set(slug, guide);
    }

    if (sdk) {
      const { name, title, summary } = sdk;

      guide.forSDK ??= {};
      guide.forSDK[name] = {
        href: u`/docs/compliance/${name.toLowerCase()}/guides/${slug}`,
        title,
        summary,
      };
    }
  }

  return Array.from(bySlug.values());
}

export type SDKSpecificGuide = Guide & { forSDK: NonNullable<Guide["forSDK"]> };

export function sdkSpecificGuides(): SDKSpecificGuide[] {
  return allGuides().filter(isSDKSpecificGuide);
}

function isSDKSpecificGuide(guide: Guide): guide is SDKSpecificGuide {
  return "forSDK" in guide;
}
