/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Для поддержки изолированных тем интерфейса и канваса
  theme: {
    screens: {
      xs: "400px",
      sm: "540px",
      md: "720px",
      lg: "960px",
      xl: "1140px",
      "2xl": "1320px",
    },
    container: {
      center: true,
      padding: "16px",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4C1D95", // Фиолетовый для админки
        },
        secondary: {
          DEFAULT: "#13C296",
        },
        stroke: {
          DEFAULT: "#DFE4EA",
        },
        dark: {
          DEFAULT: "#111928",
          2: "#1F2A37",
          3: "#374151",
          4: "#4B5563",
          5: "#6B7280",
          6: "#9CA3AF",
          7: "#D1D5DB",
          8: "#E5E7EB",
        },
        black: {
          DEFAULT: "#212B36",
        },
        gray: {
          DEFAULT: "#F9FAFB",
          1: "#F9FAFB",
          2: "#F3F4F6",
          3: "#E5E7EB",
          4: "#DEE2E6",
          5: "#CED4DA",
          6: "#CED4DA",
          7: "#CED4DA",
        },
        orange: {
          DEFAULT: "#F27430",
          dark: "#E1580E",
          light: "#F59460",
          "light-2": "#F8B490",
          "light-3": "#FBD5C0",
          "light-4": "#FDE5D8",
          "light-5": "#FFF0E9",
        },
        red: {
          DEFAULT: "#F23030",
          dark: "#E10E0E",
          light: "#F56060",
          "light-2": "#F89090",
          "light-3": "#FBC0C0",
          "light-4": "#FDD8D8",
          "light-5": "#FEEBEB",
          "light-6": "#FEF3F3",
        },
        yellow: {
          DEFAULT: "#FBB040",
          dark: "#E89A0E",
          light: "#FCC060",
          "light-2": "#FDD090",
          "light-3": "#FEE0C0",
          "light-4": "#FEE8D8",
          "light-5": "#FFF4EB",
        },
        green: {
          DEFAULT: "#13C296",
          dark: "#0E9A7A",
          light: "#42CEA8",
          "light-2": "#71DABA",
          "light-3": "#A0E6CC",
          "light-4": "#C8F0DE",
          "light-5": "#E6F8F0",
        },
        blue: {
          DEFAULT: "#3758F9",
          dark: "#2A47E8",
          light: "#5E7AFA",
          "light-2": "#879CFB",
          "light-3": "#B0BEFC",
          "light-4": "#D1DDFD",
          "light-5": "#E8EEFE",
        },
        purple: {
          DEFAULT: "#9055FD",
          dark: "#7C3AED",
          light: "#A677FE",
          "light-2": "#BC99FE",
          "light-3": "#D2BBFF",
          "light-4": "#E4D3FF",
          "light-5": "#F1E9FF",
        },
        pink: {
          DEFAULT: "#F272B6",
          dark: "#E91E63",
          light: "#F58CC6",
          "light-2": "#F8A6D6",
          "light-3": "#FAC0E6",
          "light-4": "#FCD6F0",
          "light-5": "#FDE8F5",
        },
        // Добавляем цвета для TailGrids
        body: {
          color: "#637381",
        },
        // Добавляем недостающие цвета для полной совместимости с TailGrids
        "body-color": "#637381",
        "dark-6": "#9CA3AF",
        // Добавляем правильные цвета для тем
        "blue-dark": "#1B44C8",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        '2': '0px 5px 12px 0px rgba(0, 0, 0, 0.10)',
      },
    },
  },
  plugins: [
    require("./Upload/react-pro-components-main/plugin.js"),
    require("tailwindcss-animate"),
  ],
} 