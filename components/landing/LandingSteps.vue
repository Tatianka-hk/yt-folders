<template>
    <div class="grid gap-5 md:grid-cols-3 lg:max-w-[720px]">
        <div
            v-for="(step, index) in steps"
            :key="step.title"
            class="flex items-start gap-4 md:flex-col md:items-start relative"
        >
            <div
                class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-primary text-white"
            >
                <component :is="step.icon" />
            </div>

            <div>
                <h3 class="font-semibold text-text">
                    {{ step.title }}
                </h3>

                <p class="mt-1 text-sm leading-6 text-textSecondary">
                    {{ step.description }}
                </p>
            </div>

            <!-- <IconArrowRight
                v-if="index < steps.length - 1"
                class="absolute -right-4 top-5 hidden h-5 w-5 text-primary/60 md:block"
            /> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'
import {
    IconPlay,
    IconSearch,
    IconFolder,
    IconArrowRight,
} from '~/assets/icons'

const { t } = useI18n()

const steps = computed(() => [
    {
        icon: IconFolder,
        title: `1. ${t('landing.steps.create.title')}`,
        description: t('landing.steps.create.description'),
    },
    {
        icon: IconSearch,
        title: `2. ${t('landing.steps.search.title')}`,
        description: t('landing.steps.search.description'),
    },
    {
        icon: IconPlay,
        title: `3. ${t('landing.steps.watch.title')}`,
        description: t('landing.steps.watch.description'),
    },
])
</script>
