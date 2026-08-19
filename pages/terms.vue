<template>
    <main class="w-full max-w-4xl mx-auto px-6 py-12 text-text">
        <h1 class="text-3xl font-bold mb-2">
            {{ terms.title }}
        </h1>

        <p class="text-sm text-text/60 mb-8">
            {{ terms.lastUpdated }}
        </p>

        <div class="space-y-3 mb-10">
            <p
                v-for="(paragraph, index) in terms.intro"
                :key="index"
                class="leading-7"
            >
                {{ paragraph }}
            </p>
        </div>

        <div class="space-y-8">
            <section v-for="(section, index) in terms.sections" :key="index">
                <h2 class="text-xl font-semibold mb-3">
                    {{ section.title }}
                </h2>

                <p
                    v-for="(paragraph, paragraphIndex) in section.paragraphs"
                    :key="paragraphIndex"
                    class="mb-3 leading-7"
                >
                    {{ paragraph }}
                </p>

                <ul
                    v-if="section.list?.length"
                    class="list-disc pl-6 space-y-2 mb-4"
                >
                    <li
                        v-for="(item, itemIndex) in section.list"
                        :key="itemIndex"
                    >
                        {{ item }}
                    </li>
                </ul>

                <p
                    v-for="(paragraph, index) in section.after ?? []"
                    :key="index"
                    class="mb-3 leading-7"
                >
                    {{ paragraph }}
                </p>
            </section>
        </div>
    </main>
</template>

<script setup lang="ts">
import termsUa from '~/data/terms/ua'
import termsEn from '~/data/terms/en'
import termsEs from '~/data/terms/esp'
import termsCa from '~/data/terms/cat'
import type esp from '~/data/policy/esp'

const { locale } = useI18n()

const termsByLocale = {
    ua: termsUa,
    en: termsEn,
    esp: termsEs,
    cat: termsCa,
}

const terms = computed(() => {
    return termsByLocale[locale.value as keyof typeof termsByLocale] ?? termsEn
})

useHead(() => ({
    title: `${terms.value.title} | ytCarpets`,
}))
</script>
