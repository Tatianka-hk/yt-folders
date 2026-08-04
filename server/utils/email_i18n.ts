import ua from '~/i18n/locales/ua.json'
import en from '~/i18n/locales/en.json'
import esp from '~/i18n/locales/esp.json'
import cat from '~/i18n/locales/cat.json'

export type AppLocale = 'ua' | 'en' | 'esp' | 'cat'

type TranslationValue = string | Record<string, unknown>

const translations = {
    ua,
    en,
    esp,
    cat,
} as const

export function normalizeLocale(locale?: string): AppLocale {
    switch (locale?.toLowerCase()) {
        case 'ua':
            return 'ua'

        case 'es':
            return 'esp'

        case 'ca':
            return 'cat'

        case 'en':

        default:
            return 'en'
    }
}

export function getEmailTranslation(locale: AppLocale, path: string): string {
    const keys = path.split('.')

    let value: TranslationValue = translations[locale] as TranslationValue

    for (const key of keys) {
        if (typeof value !== 'object' || value === null || !(key in value)) {
            console.warn(
                `Missing email translation: "${path}" for locale "${locale}"`
            )

            return path
        }

        value = value[key] as TranslationValue
    }

    return typeof value === 'string' ? value : path
}
