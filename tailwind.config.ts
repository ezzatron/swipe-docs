import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import type { PluginUtils } from "tailwindcss/types/config";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [typography],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      typography: ({ theme }: PluginUtils) => ({
        DEFAULT: {
          css: {
            "--tw-prose-code-bg": theme("colors.gray.100"),
            code: {
              backgroundColor: "var(--tw-prose-code-bg)",
              borderRadius: theme("borderRadius.DEFAULT"),
              color: null,
              fontWeight: null,
              paddingBlock: ".2em",
              paddingInline: ".4em",
              tabSize: "2",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
          },
        },
        invert: {
          css: {
            "--tw-prose-code-bg": theme("colors.gray.700"),
          },
        },
      }),
    },
  },
} satisfies Config;
