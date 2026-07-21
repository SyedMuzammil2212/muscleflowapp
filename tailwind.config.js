/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: "#F8C61E",
        dark: "#252C37",
        darker: "#10141D",
        deepest: "#0D141E",
        "deepest-2": "#0B0E14",
        card: "#19202B",
        "card-alt": "#26231E",
        "card-dark": "#151B26",
        surface: "#1C2534",
        "surface-2": "#232A35",
        "surface-3": "#3F4A5B",
        muted: "#D2C5AC",
        "muted-dim": "#9A9079",
        "text-primary": "#DCE3F1",
        "text-muted": "#6B7C96",
        "text-subtle": "#95A1B5",
        border: "#2B3547",
        "border-accent": "#4E4633",
        "border-card": "#232E3F",
        "border-otp": "#3D372C",
        "tab-active": "#3F4A5B",
      },
    },
  },
  plugins: [],
};
