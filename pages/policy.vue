<template>
    <main class="w-full max-w-4xl mx-auto px-6 py-12 text-text">
        <h1 class="text-3xl font-bold mb-2">
            {{ policy.title }}
        </h1>

        <p class="text-sm text-text/60 mb-8">
            {{ policy.lastUpdated }}
        </p>

        <div class="space-y-3 mb-10">
            <p
                v-for="(paragraph, index) in policy.intro"
                :key="index"
                class="leading-7"
            >
                {{ paragraph }}
            </p>
        </div>

        <div class="space-y-8">
            <section v-for="(section, index) in policy.sections" :key="index">
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
            </section>
        </div>
    </main>
</template>

<script setup lang="ts">
import policyUa from '~/data/policy/ua'
import policyEn from '~/data/policy/en'
import policyEs from '~/data/policy/esp'
import policyCa from '~/data/policy/cat'

const { locale } = useI18n()

const policyByLocale = {
    ua: policyUa,
    en: policyEn,
    esp: policyEs,
    cat: policyCa,
}

const policy = computed(() => {
    return (
        policyByLocale[locale.value as keyof typeof policyByLocale] ?? policyEn
    )
})

useHead(() => ({
    title: `${policy.value.title} | ytCarpets`,
}))
</script>
