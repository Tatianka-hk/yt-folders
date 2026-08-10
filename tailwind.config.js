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
                text: '#f4f4f9',

                // Primary actions: Create, LOgin, Save
                primary: '#33202a',

                // Secondary actions: Sign up
                secondary: '#262633',

                primaryHover: '#402936',
                secondaryHover: '#323242',
                primaryDisabled: '#1a1518',
                secondaryDisabled: '#181820',

                // Regular surfaces: folders, cards, dropdown items
                surface: '#21191f',

                // Active/selected surface: selected folder, active menu item
                surfaceActive: '#33202a',

                // Input background
                input: '#27232d',

                // Input borders, subtle UI elements
                border: '#5f5566',

                // Secondary text: channel names, additional information
                textSecondary: '#a9a4b0',

                // Muted text: dates, timestamps, less important information
                textMuted: '#8b8492',
            },
            fontFamily: {
                julius: ['"Julius Sans One"', 'sans-serif'],
            },
        },
    },

    plugins: [],
}
