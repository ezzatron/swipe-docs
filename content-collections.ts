import { defineCollection, defineConfig } from "@content-collections/core";

const docs = defineCollection({
  name: "docs",
  directory: "src/app/docs",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    summary: z.string(),
    sdk: z.optional(z.enum(["android", "dotnet", "ios", "web"])),
    form: z.optional(z.enum(["tutorial", "how-to", "explainer", "reference"])),
    key: z.optional(z.string()),
  }),
});

export default defineConfig({
  collections: [docs],
});
