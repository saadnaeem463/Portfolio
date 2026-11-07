module.exports = {
  content: ["./app/**/*.js", "./components/**/*.js"],
  theme: { extend: {
    colors: { ink: "#090909", paper: "#f2efeb", red: { DEFAULT: "#e32b3c", dark: "#b81f2e" }, mute: "#a09c9a", line: "rgba(242,239,235,.12)" },
    fontFamily: {
      display: ["Anton", "Impact", "sans-serif"],
      body: ["Manrope", "system-ui", "sans-serif"],
      hand: ["Caveat", "cursive"],
    },
  } },
  plugins: [],
};
