   /** @type {import('tailwindcss').Config} */
   module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx,vue}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#2563eb",
          "primary-foreground": "#fff",
          // 其他自定义色
        },
      },
    },
    plugins: [],
  }