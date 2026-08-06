/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './app.vue',
        './components/*.vue',
        './pages/*.vue',
        './ui/*.vue',
        './**/*.vue',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#33202a',
                background: '#0d0d12',
                secondary: '#5f5566',
                text: '#f4f4f9',
            },
            fontFamily: {
                julius: ['"Julius Sans One"', 'sans-serif'],
            },
        },
    },

    plugins: [],
}
