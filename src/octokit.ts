import { Octokit } from "octokit";

declare global {
  var octokit: Octokit | undefined;
}

export function createOctokit(): Octokit {
  return (globalThis.octokit ??= new Octokit({
    auth: process.env.GITHUB_TOKEN,
  }));
}
