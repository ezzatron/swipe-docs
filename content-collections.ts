import { defineCollection, defineConfig } from "@content-collections/core";

const docs = defineCollection({
  name: "docs",
  directory: "src/app/docs",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    summary: z.string(),
    form: z.optional(z.enum(["tutorial", "guide", "explainer", "reference"])),
    slug: z.optional(z.string()),
    sdk: z.optional(
      z.object({
        name: z.enum(["iOS", "Web"]),
        title: z.optional(z.string()),
        summary: z.optional(z.string()),
      }),
    ),
  }),
});

export default defineConfig({
  collections: [docs],
});

export type SDKName = "iOS" | "Web";
