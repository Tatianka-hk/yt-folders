<template>
    <div class="w-full flex flex-col items-center justify-center">
        <Logo class="mt-[80px] mb-[40px] mx-auto" />

        <div
            class="flex flex-col items-center text-center gap-4 mx-auto w-[80%] lg:w-[700px] mb-[40px]"
        >
            <h1 class="text-2xl font-semibold">
                {{ title }}
            </h1>

            <p class="text-base">
                {{ description }}
            </p>
        </div>

        <VButton
            v-if="status === 'error'"
            :onClick="verifyEmail"
            :disabled="isLoading"
        >
            {{
                isLoading
                    ? t('auth.verify_email.actions.verifying')
                    : t('auth.verify_email.actions.retry')
            }}
        </VButton>

        <VButton v-if="status === 'success'" :onClick="goToLogin">
            {{ t('auth.verify_email.actions.login') }}
        </VButton>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { navigateTo, useRoute } from 'nuxt/app'

import { Logo, VButton } from '~/ui'
import { useSnackbar } from '~/composables/useSnackbar'
import { verifyEmail as verifyEmailApi } from '~/apis/auth'

type VerificationStatus = 'loading' | 'success' | 'error' | 'invalid'

const { t } = useI18n()
const route = useRoute()
const { showSnackbar } = useSnackbar()

const status = ref<VerificationStatus>('loading')
const isLoading = ref(false)

const token = computed(() => {
    const routeToken = route.query.token

    return typeof routeToken === 'string' ? routeToken : ''
})

const title = computed(() => {
    switch (status.value) {
        case 'success':
            return t('auth.verify_email.success.title')

        case 'error':
            return t('auth.verify_email.error.title')

        case 'invalid':
            return t('auth.verify_email.invalid_token.title')

        default:
            return t('auth.verify_email.loading.title')
    }
})

const description = computed(() => {
    switch (status.value) {
        case 'success':
            return t('auth.verify_email.success.description')

        case 'error':
            return t('auth.verify_email.error.description')

        case 'invalid':
            return t('auth.verify_email.invalid_token.description')

        default:
            return t('auth.verify_email.loading.description')
    }
})

async function verifyEmail() {
    if (!token.value) {
        status.value = 'invalid'
        return
    }

    isLoading.value = true
    status.value = 'loading'

    try {
        await verifyEmailApi(token.value)
        status.value = 'success'

        showSnackbar(t('auth.verify_email.success.snackbar'), 'success')
    } catch (error) {
        status.value = 'error'

        showSnackbar(t('auth.verify_email.error.snackbar'), 'error')
    } finally {
        isLoading.value = false
    }
}

function goToLogin() {
    navigateTo('/login')
}

onMounted(() => {
    verifyEmail()
})
</script>
