import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                },
                ludico: {
                    pink: '#f472b6',
                    yellow: '#facc15',
                    green: '#4ade80',
                    blue: '#60a5fa',
                }
            },
            fontFamily: {
                plano: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
};
export default config;
