/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0D1A",
        rail: "#10162F",
        dawn: "#FAD689",
        mango: "#F2A55B",
        teal: "#4BC4B7",
        sand: "#F8F1E8",
        ember: "#E26A2C",
        sky: "#E6F2FF",
        ocean: "#1F4B99",
        peach: "#FFD7BA",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(242, 165, 91, 0.35)",
        soft: "0 12px 30px rgba(16, 22, 47, 0.08)",
      },
      backgroundImage: {
        "hero-grad":
          "radial-gradient(circle at top left, rgba(75,196,183,0.22), rgba(248,241,232,1) 55%), radial-gradient(circle at top right, rgba(242,165,91,0.2), rgba(248,241,232,0) 50%)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        fadeUp: "fadeUp 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
