<template>
    <div class="w-full flex flex-col items-center justify-center">
        <Logo class="mt-[80px] mb-[40px] mx-auto" />

        <div
            class="flex flex-col gap-4 mx-auto w-[80%] lg:w-[700px] mb-[40px] space-y-2"
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
        </div>
        <VButton :disabled="!email || !password" :onClick="onClick">{{
            t('auth.actions.login')
        }}</VButton>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { login } from '~/apis/auth'
import { Field, Logo, VButton } from '~/ui'
import { useSnackbar } from '~/composables/useSnackbar'
import { navigateTo } from 'nuxt/app'
import { useAuth } from '~/composables/useAuth'
const { showSnackbar } = useSnackbar()

const { t } = useI18n()
const email = ref('')
const password = ref('')

const onClick = () => {
    login({ email: email.value, password: password.value })
        .then(async () => {
            const { fetchAuth } = useAuth()
            await fetchAuth()
        })
        .then(() => {
            navigateTo('/home')
        })
        .catch((err) => {
            showSnackbar(
                err instanceof Error && err.message === 'Invalid data'
                    ? t('auth.errors.invalid_credentials')
                    : err.message ===
                        'Too many login attempts. Try again later.'
                      ? t('auth.errors.too_many_attempts')
                      : t('auth.errors.something_went_wrong'),
                'error'
            )
        })
}
</script>
