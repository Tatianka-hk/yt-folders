<template>
    <div class="w-full flex flex-col items-center justify-center">
        <Logo class="mt-[80px] mb-[40px] mx-auto" :size="Size.medium" />

        <template v-if="etap === ETAP_ENUM.SIGNUP">
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
            <AcceptTermsAndConditions v-model="acceptedPolicy" />
            <div v-if="isLoading">
                <Loading />
            </div>
            <VButton
                :disabled="
                    !email ||
                    !password ||
                    !confirmPassword ||
                    isLoading ||
                    !acceptedPolicy
                "
                :onClick="onClick"
                :ariaLabel="t('auth.actions.signup')"
            >
                {{ t('auth.actions.signup') }}
            </VButton>
        </template>
        <template v-else>
            <EndOfSignup :email="email" />
        </template>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '#imports'

import { registerUser } from '~/apis/auth'
import { Field, Logo, VButton, Loading } from '~/ui'
import EndOfSignup from '~/components/auth/EndOfSignup.vue'
import { Size } from '~/types'
import AcceptTermsAndConditions from '~/components/auth/AcceptTermsAndConditions.vue'
import { useSnackbar } from '../composables/useSnackbar'
import { isValidEmail, isValidPassword } from '~/utils/auth'

const { showSnackbar } = useSnackbar()
const { t, locale } = useI18n()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptedPolicy = ref(false)
const isLoading = ref<boolean>(false)

enum ETAP_ENUM {
    SIGNUP = 'signup',
    VERIFY = 'verify',
}
const etap = ref<ETAP_ENUM>(ETAP_ENUM.SIGNUP)

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
            etap.value = ETAP_ENUM.VERIFY
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
