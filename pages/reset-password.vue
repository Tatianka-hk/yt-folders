<template>
    <div class="w-full flex flex-col items-center justify-center">
        <Logo class="mt-[80px] mb-[40px] mx-auto" :size="Size.medium" />

        <div
            class="flex flex-col gap-4 mx-auto w-[80%] lg:w-[700px] mb-[24px] space-y-2"
        >
            <h1 class="text-2xl font-semibold text-center text-white">
                {{ t('auth.reset_password.title') }}
            </h1>

            <p class="text-center text-text">
                {{ t('auth.reset_password.description') }}
            </p>

            <Field
                type="email"
                name="email"
                :label="t('auth.labels.email')"
                v-model="email"
            />
        </div>

        <div v-if="isLoading">
            <Loading />
        </div>

        <div
            v-else-if="isSuccess"
            class="w-[80%] lg:w-[700px] flex flex-col items-center gap-4"
        >
            <p class="text-center text-text">
                {{ t('auth.reset_password.success') }}
            </p>

            <p class="text-center text-text/70">
                {{ t('auth.reset_password.not_received') }}
            </p>

            <button
                type="button"
                class="text-white underline hover:opacity-80"
                :disabled="isLoading"
                @click="onSubmit"
            >
                {{ t('auth.reset_password.resend') }}
            </button>
        </div>

        <div v-else class="w-[80%] lg:w-[700px] flex flex-col items-center">
            <VButton
                :ariaLabel="t('auth.reset_password.submit')"
                :disabled="!email || isLoading"
                :onClick="onSubmit"
            >
                {{ t('auth.reset_password.submit') }}
            </VButton>
        </div>

        <button
            type="button"
            class="mt-6 text-sm text-text underline hover:opacity-80"
            @click="goToRoute('login')"
        >
            {{ t('auth.reset_password.back_to_login') }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '#imports'

import { resetPassword } from '~/apis/auth'
import { Field, Logo, VButton, Loading } from '~/ui'
import { useSnackbar } from '~/composables/useSnackbar'
import { useCustomRoute } from '~/composables/useCustomRoute'
import { Size } from '~/types'

const { t, locale } = useI18n()
const { showSnackbar } = useSnackbar()
const { goToRoute } = useCustomRoute()

const email = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)

const onSubmit = async () => {
    if (!email.value || isLoading.value) {
        return
    }

    isLoading.value = true

    try {
        await resetPassword({
            email: email.value,
            locale: locale.value,
        })

        isSuccess.value = true

        showSnackbar(t('auth.reset_password.success'), 'success')
    } catch (err: any) {
        console.error(err)

        isSuccess.value = false

        showSnackbar(
            t(`auth.reset_password.errors.${err?.message ?? 'default'}`),
            'error'
        )
    } finally {
        isLoading.value = false
    }
}
</script>
