module.exports = {
  content: ["./app/**/*.js", "./components/**/*.js"],
  theme: { extend: {
    colors: {
      bg: { DEFAULT: "#1a1a1a", 2: "#222222", 3: "#2a2a2a" },
      txt: { DEFAULT: "#f0f0f0", 2: "#c0c0c0", muted: "#888888" },
      teal: { DEFAULT: "#004d61", light: "#006e8a" },
      ruby: { DEFAULT: "#822659", light: "#a33070" },
      silver: "#c0c0c0",
    },
    fontFamily: {
      heading: ["'Clash Display'", "sans-serif"],
      body: ["'General Sans'", "sans-serif"],
      label: ["Inter", "sans-serif"],
      mono: ["'SF Mono'", "'Fira Code'", "'Cascadia Code'", "monospace"],
    },
  } },
  plugins: [],
};
