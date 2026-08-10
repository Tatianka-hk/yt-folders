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
                // Main page background
                background: '#0d0d12',

                // Main text: titles, labels, important content
                text: '#f1f1f5',

                // Primary actions: Create, LOgin, Save
                primary: '#33202a',

                // Secondary actions: Sign up
                secondary: '#262633',

                primaryHover: '#402936',
                secondaryHover: '#323242',
                primaryDisabled: '#1a1518',
                secondaryDisabled: '#181820',
            },
            fontFamily: {
                julius: ['"Julius Sans One"', 'sans-serif'],
            },
        },
    },

    plugins: [],
}
