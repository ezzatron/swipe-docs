import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-code-bg": "var(--color-gray-100)",
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
