import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

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
