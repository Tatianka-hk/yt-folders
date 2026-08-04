<template>
    <div class="w-full flex flex-col items-center justify-center">
        <Logo class="mt-[80px] mb-[40px] mx-auto" />

        <div
            class="flex flex-col gap-4 mx-auto w-[700px] mb-[40px] w-[80%] lg:w-[700px] space-y-2"
        >
            <Field
                type="email"
                name="email"
                :label="t('auth.labels.email')"
                v-model="email"
            />
            <Field
                type="password"
                name="password"
                :label="t('auth.labels.password')"
                v-model="password"
            />
            <Field
                type="password"
                name="confirm_password"
                :label="t('auth.labels.confirm_password')"
                v-model="confirmPassword"
            />
        </div>
        <VButton
            :disabled="!email || !password || !confirmPassword || isLoading"
            :onClick="onClick"
        >
            {{ t('auth.actions.signup') }}
        </VButton>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { navigateTo } from 'nuxt/app'
import { registerUser } from '~/apis/auth'
import { Field, Logo, VButton } from '~/ui'
import { useSnackbar } from '../composables/useSnackbar'
const { showSnackbar } = useSnackbar()
const { t, locale } = useI18n()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref<boolean>(false)

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPassword(password: string): boolean {
    return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password)
}

const onClick = () => {
    if (!isValidEmail(email.value)) {
        showSnackbar(t('auth.errors.email_invalid'), 'error')
        return
    }
    if (!isValidPassword(password.value)) {
        showSnackbar(t('auth.errors.password_invalid'), 'error')
        return
    }
    if (confirmPassword.value !== password.value) {
        showSnackbar(t('auth.errors.password_mismatch'), 'error')
        return
    }
    isLoading.value = true
    registerUser({
        email: email.value,
        password: password.value,
        locale: locale.value,
    })
        .then(() => {
            navigateTo('/login')
        })
        .catch((err) => {
            showSnackbar(
                err instanceof Error && err.message === 'User already exists'
                    ? t('auth.errors.email_exists')
                    : t('auth.errors.something_went_wrong'),
                'error'
            )
        })
        .finally(() => {
            isLoading.value = false
        })
}
</script>
