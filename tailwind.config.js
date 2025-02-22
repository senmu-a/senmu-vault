/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // 确保包含所有源文件
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: '#48e59b', // 这样可以直接使用 bg-primary
          light: '#5ff7ad', // 可以使用 bg-primary-light
          dark: '#3bc982', // 可以使用 bg-primary-dark
        },
      },
    },
  },
  plugins: [],
};
