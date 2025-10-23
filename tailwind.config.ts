import type { Config } from "tailwindcss";

const plugin = require("tailwindcss/plugin");

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        plusJakartaSansRegular: ["PlusJakartaSans-Regular"],
        plusJakartaSansItalic: ["PlusJakartaSans-Italic"],
        plusJakartaSansLight: ["PlusJakartaSans-Light"],
        plusJakartaSansLightItalic: ["PlusJakartaSans-LightItalic"],
        plusJakartaSansMedium: ["PlusJakartaSans-Medium"],
        plusJakartaSansMediumItalic: ["PlusJakartaSans-MediumItalic"],
        plusJakartaSansSemiBold: ["PlusJakartaSans-SemiBold"],
        plusJakartaSansSemiBoldItalic: ["PlusJakartaSans-SemiBoldItalic"],
        plusJakartaSansBold: ["PlusJakartaSans-Bold"],
        plusJakartaSansBoldItalic: ["PlusJakartaSans-BoldItalic"],
        plusJakartaSansExtraLight: ["PlusJakartaSans-ExtraLight"],
        plusJakartaSansExtraLightItalic: ["PlusJakartaSans-ExtraLightItalic"],
        plusJakartaSansExtraBold: ["PlusJakartaSans-ExtraBold"],
        plusJakartaSansExtraBoldItalic: ["PlusJakartaSans-ExtraBoldItalic"],
      },
      borderWidth: {
        "1": "1px",
      },
      colors: {
        accent: {
          bluePrimary: "#007AFF",
          blueSecondary: "#0360C6",
          blueSubtle: "#E5EFFF",
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        neutral: {
          blackPrimary: "#1f1f1f",
          grayPrimary: "#929292",
          graySecondary: "#EFEFEF",
          grayTerciary: "#f3f5f7",
        },
        feedback: {
          success: {
            lighter: "#ECFDF5",
            light: "#34D399",
            DEFAULT: "#10B981",
            dark: "#059669",
            darker: "#064E3B",
          },
          info: {
            lighter: "#EFF6FF",
            light: "#60A5FA",
            DEFAULT: "#3B82F6",
            dark: "#2563EB",
            darker: "#172554",
          },
          warning: {
            lighter: "#FFFBEB",
            light: "#FCD34D",
            DEFAULT: "#F59E0B",
            dark: "#D97706",
            darker: "#78350F",
          },
          error: {
            lighter: "#FEF2F2",
            light: "#F87171",
            DEFAULT: "#ED5A46",
            dark: "#DC2626",
            darker: "#7F1D1D",
          },
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(({ addComponents, theme }: { addComponents: any; theme: any }) => {
      addComponents({
        ".headline-large": {
          fontSize: "56px",
          lineHeight: "58px",
          fontWeight: "500",
          letterSpacing: "-3px",
          fontFamily: theme("fontFamily.plusJakartaSansMedium"),
        },
        ".headline-medium": {
          fontSize: "38px",
          lineHeight: "42px",
          fontWeight: "500",
          letterSpacing: "-1px",
          fontFamily: theme("fontFamily.plusJakartaSansMedium"),
        },
        ".headline-small": {
          fontSize: "26px",
          lineHeight: "32px",
          fontWeight: "500",
          letterSpacing: "-1px",
          fontFamily: theme("fontFamily.plusJakartaSansMedium"),
        },
        ".subhead-large": {
          fontSize: "24px",
          lineHeight: "28px",
          fontWeight: "500",
          fontFamily: theme("fontFamily.plusJakartaSansMedium"),
          "@screen lg": {
            fontSize: "40px",
            lineHeight: "44px",
          },
        },
        ".subhead-medium": {
          fontSize: "18px",
          lineHeight: "24px",
          fontWeight: "500",
          fontFamily: theme("fontFamily.plusJakartaSansMedium"),
          "@screen lg": {
            fontSize: "24px",
            lineHeight: "28px",
          },
        },
        ".subhead-small": {
          fontSize: "16px",
          lineHeight: "20px",
          fontWeight: "500",
          fontFamily: theme("fontFamily.plusJakartaSansMedium"),
        },
        ".body-small": {
          fontSize: "15px",
          lineHeight: "21px",
          fontWeight: "400",
          fontFamily: theme("fontFamily.plusJakartaSansRegular"),
        },
        ".body-medium": {
          fontSize: "18px",
          lineHeight: "24px",
          fontWeight: "500",
          fontFamily: theme("fontFamily.plusJakartaSansRegular"),
        },
      });
    }),
  ],
};

export default config;
