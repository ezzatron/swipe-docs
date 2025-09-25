import { evaluate } from "@mdx-js/mdx";
import type { GetResponseDataTypeFromEndpointMethod } from "@octokit/types";
import type { Octokit } from "octokit";
import type { ReactNode } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import { useMDXComponents } from "../../../mdx-components";
import { createOctokit } from "../../../octokit";

type Params = {
  repo: string;
};

// Update once per minute
export const revalidate = 60;

// 404 if the name is not in our static list
export const dynamicParams = false;

// These names are allowed (and pre-generated)
export function generateStaticParams(): Params[] {
  return [
    { repo: "austenite" },
    { repo: "fake-geolocation" },
    { repo: "fake-permissions" },
    { repo: "nvector-go" },
    { repo: "nvector-js" },
  ];
}

type ReleaseSummary = GetResponseDataTypeFromEndpointMethod<
  Octokit["rest"]["repos"]["listReleases"]
>[number];

type Props = {
  params: Promise<Params>;
};

export default async function ChangelogPage({ params }: Props) {
  const { repo } = await params;
  const octokit = createOctokit();

  const pages = octokit.paginate.iterator(octokit.rest.repos.listReleases, {
    owner: "ezzatron",
    repo,
  });

  const releases: ReleaseSummary[] = [];
  for await (const { data: page } of pages) releases.push(...page);

  return (
    <>
      <h1>ezzatron/{repo}</h1>

      {releases.map((release) => (
        <Release key={release.id} release={release} />
      ))}
    </>
  );
}

async function Release({
  release: { name, body },
}: {
  release: ReleaseSummary;
}) {
  const content: ReactNode = await (async () => {
    if (typeof body === "string") {
      try {
        const { default: Content } = await evaluate(body, {
          ...jsxRuntime,
          format: "md",
          useMDXComponents: () => useMDXComponents({}),
          rehypePlugins: [rehypeMdxCodeProps],
        });

        return <Content />;
      } catch {
        // fall through
      }
    }

    return <p className="text-red-600">Unable to show release notes</p>;
  })();

  return (
    <>
      <h2>{name}</h2>
      {content}
    </>
  );
}
