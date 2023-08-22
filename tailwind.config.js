/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        one: "#2B2D42",
        two: "#8D99AE",
        three: "#EDF2F4",
        four: "#EF233C",
        five: "#D80032",
        six: "#0080DC",
        seven: "#181921",
        eight: "#EDF2F4",
        nine: "#FBBEBE",
      },
      fontFamily: {
        jetbrains: ["JetbrainsMono"],
        bebas: "Bebas Neue",
        poppins: "Poppins",
        poppinsbold: "PoppinsBold",
        roboto: "Roboto",
        hacked: ["Hacked"],
      },
    },
  },
  plugins: [],
}
