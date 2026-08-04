// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    components: [{ path: '~/components' }, { path: '~/ui', pathPrefix: false }],
    css: ['~/assets/main.css'],
    modules: ['@nuxtjs/i18n', '@nuxtjs/tailwindcss'],
    i18n: {
        locales: [
            { code: 'en', file: 'en.json' },
            { code: 'ua', file: 'ua.json' },
            { code: 'esp', file: 'esp.json' },
            { code: 'cat', file: 'cat.json' },
        ],
        defaultLocale: 'ua',
        langDir: 'locales/',
    },
    runtimeConfig: {
        smtpUser: '',
        smtpPassword: '',
        smtpPort: 587,
        emailFrom: '',
        smtpHost: '',

        public: {
            appUrl: '',
        },
    },
})
