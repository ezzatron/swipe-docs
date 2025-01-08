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
            code: {
              backgroundColor: theme("colors.gray.800"),
              borderRadius: theme("borderRadius.DEFAULT"),
              color: null,
              fontWeight: null,
              paddingBlock: theme("padding.1"),
              paddingInline: theme("padding.2"),
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
      }),
    },
  },
} satisfies Config;
