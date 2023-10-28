import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
    },
    screens: {
      sm: { min: "576px", max: "767px" },
      md: { min: "768px", max: "991px" },
      mmd: { min: "992px", max: "1295px" },
      lg: { min: "1296px", max: "1199px" },
      xl: { min: "1200px" },
    },
  },
  purge: {
    options: {
      safelist: [
        "text-teal-800",
        "text-pink-800",
        "text-amber-800",
        "bg-teal-100",
        "bg-pink-100",
        "bg-amber-100",
      ],
    },
  },

  plugins: [],
} satisfies Config;
