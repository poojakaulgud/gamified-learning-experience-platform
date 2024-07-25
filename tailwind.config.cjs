/** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
//   theme: {
//     extend: {
//       backgroundImage: {
//         'gradient-radial': 'radial-gradient(#4442E3, #302ECF)',
//       },
//     },

//     // Custom colors
//     // colors: {
//     //   'glx-orange': '#F37037',
//     //   'glx-light-orange': '#FFE6DC',
//     //   'text-lightbg': '#403A37',
//     // },
//   },
//   plugins: [],
// };
const flowbite = require('flowbite-react/tailwind');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', flowbite.content()],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(#4442E3, #302ECF)',
      },
    },

    // base and custom breakpoints
    screens: {
      '2xs': '150px',
      // => @media (min-width: 640px) { ... }
      xs: '300px',
      // => @media (min-width: 640px) { ... }
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },

    // Custom colors
    // colors: {
    //   'glx-orange': '#F37037',
    //   'glx-light-orange': '#FFE6DC',
    //   'text-lightbg': '#403A37',
    //   'method-purple-900': '#0E0D2D',
    //   'method-purple-500': '#4442E3',
    //   'method-purple-300': '#8F8EEE',
    //   'method-purple-50': '#ECECFC',
    //   'color-fill-error': '#EF4444',
    //   'color-fill-tertiary': '#F5F5F5',
    // },
  },
  plugins: [require('flowbite/plugin')],
};
