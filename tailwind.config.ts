import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-code-bg": "var(--color-gray-200)",
            code: {
              backgroundColor: "var(--tw-prose-code-bg)",
              borderRadius: "var(--radius-sm)",
              color: null,
              fontWeight: null,
              paddingBlock: "0.2em",
              paddingInline: "0.4em",
              tabSize: "2",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            summary: {
              borderRadius: "var(--radius-xs)",
            },
          },
        },
        invert: {
          css: {
            "--tw-prose-code-bg": "var(--color-gray-700)",
          },
        },
      },
    },
  },
} satisfies Config;
