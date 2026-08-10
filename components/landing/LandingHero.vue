<template>
    <div class="pt-8 lg:pt-0 text-center lg:text-left">
        <div
            class="mx-auto mb-5 w-fit rounded-full bg-surface px-4 py-2 text-text text-sm text-primary lg:mx-0"
        >
            {{ t('landing.badge') }}
        </div>

        <h1
            class="text-[35px] font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl"
        >
            YouTube Carpets
        </h1>

        <p
            class="mx-auto mt-6 max-w-[620px] text-base leading-7 text-textSecondary sm:text-lg lg:mx-0 lg:text-xl lg:leading-8"
        >
            {{ t('landing.description') }}
        </p>

        <div
            class="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
        >
            <VButton :onClick="() => goToRoute('login')" extraClass="!py-2 ">
                {{ t('auth.actions.login') }}
            </VButton>
            <VButton
                :onClick="() => goToRoute('signup')"
                :variant="BUTTON_VARIANT.SECONDARY"
                extraClass="!py-2"
            >
                {{ t('auth.actions.signup') }}
            </VButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCustomRoute, useI18n } from '#imports'
import { BUTTON_VARIANT } from '~/static'

import { VButton } from '~/ui'

const { t } = useI18n()
const { goToRoute } = useCustomRoute()
</script>
