/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                pink: {
                    50: '#fff5f7',
                    100: '#ffe0e8',
                    200: '#ffb6c1',
                    500: '#ff6b9a',
                },
            },
            boxShadow: {
                soft: '0 4px 12px rgba(0, 0, 0, 0.05)',
            },
            fontFamily: {
                sans: ['"Gowun Dodum"', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
