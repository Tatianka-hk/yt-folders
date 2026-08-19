<template>
    <div class="w-full flex flex-col items-center justify-center">
        <Logo class="mt-[80px] mb-[40px] mx-auto" :size="Size.medium" />

        <div class="flex flex-col gap-4 mx-auto w-[80%] lg:w-[700px] mb-[24px]">
            <h1 class="text-2xl font-semibold text-center text-white">
                {{ t('auth.reset_password_change.title') }}
            </h1>

            <p class="text-center text-text/70">
                {{ t('auth.reset_password_change.description') }}
            </p>

            <Field
                type="password"
                name="password"
                :label="t('auth.reset_password_change.password')"
                v-model="password"
            />

            <Field
                type="password"
                name="confirmPassword"
                :label="t('auth.reset_password_change.confirm_password')"
                v-model="confirmPassword"
            />

            <p v-if="passwordsDoNotMatch" class="text-sm text-red-500">
                {{ t('auth.reset_password_change.errors.not_match') }}
            </p>
        </div>

        <div v-if="isLoading">
            <Loading />
        </div>

        <div
            v-else-if="isSuccess"
            class="w-[80%] lg:w-[700px] flex flex-col items-center gap-4"
        >
            <p class="text-center text-text">
                {{ t('auth.reset_password_change.success') }}
            </p>

            <VButton
                :ariaLabel="t('auth.reset_password_change.to_login')"
                :onClick="goToLogin"
            >
                {{ t('auth.reset_password_change.to_login') }}
            </VButton>
        </div>

        <VButton
            v-else
            :ariaLabel="t('auth.reset_password_change.submit')"
            :disabled="isSubmitDisabled"
            :onClick="onSubmit"
        >
            {{ t('auth.reset_password_change.submit') }}
        </VButton>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useI18n } from '#imports'

import { Logo, Field, VButton, Loading } from '~/ui'
import { Size } from '~/types'
import { useSnackbar } from '~/composables/useSnackbar'
import { useCustomRoute } from '~/composables/useCustomRoute'
import { PASSWORD_MIN_LENGTH } from '~/static/auth'

const { t } = useI18n()
const route = useRoute()
const { showSnackbar } = useSnackbar()
const { goToRoute } = useCustomRoute()

const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)

const token = computed(() => {
    const value = route.query.token

    return typeof value === 'string' ? value : ''
})

const passwordsDoNotMatch = computed(() => {
    if (!password.value || !confirmPassword.value) {
        return false
    }

    return password.value !== confirmPassword.value
})

const isSubmitDisabled = computed(() => {
    return (
        !token.value ||
        !password.value ||
        !confirmPassword.value ||
        password.value.length < PASSWORD_MIN_LENGTH ||
        passwordsDoNotMatch.value ||
        isLoading.value
    )
})

const onSubmit = async () => {
    if (isSubmitDisabled.value) {
        return
    }

    isLoading.value = true

    try {
        await $fetch('/api/auth/reset-password/confirm', {
            method: 'POST',
            body: {
                token: token.value,
                password: password.value,
            },
        })

        isSuccess.value = true

        showSnackbar(t('auth.reset_password_change.success'), 'success')
    } catch (err: any) {
        console.error(err)

        const errorKey =
            err?.data?.statusMessage || err?.statusMessage || 'default'

        showSnackbar(
            t(`auth.reset_password_change.errors.${errorKey}`),
            'error'
        )
    } finally {
        isLoading.value = false
    }
}

const goToLogin = () => {
    goToRoute('login')
}
</script>
