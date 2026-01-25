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
                primary: '#f8d9d5',
                background: '#f4edf6',
                accent: '#84d3b6',
                danger: '#ed655e',
                text: '#4b4444',
                thirty: '#fde1f7',
                blue: '#d8e2ec',
                error: '#ed655e',
                hoverblue: '#c5d2e0',
                hoverbackground: '#e8dbed',
                mint: '#4e9c83',
            },
            fontFamily: {
                julius: ['"Julius Sans One"', 'sans-serif'],
            },
        },
    },

    plugins: [],
}
