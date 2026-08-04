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
        <PleaseVerifyEmail :email="email" v-if="notVerifiedEmail" />
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { navigateTo } from 'nuxt/app'

import { login } from '~/apis/auth'
import { Field, Logo, VButton } from '~/ui'
import { useSnackbar } from '~/composables/useSnackbar'
import { useAuth } from '~/composables/useAuth'
import { LOGIN_ERRORS } from '~/static/auth'
import PleaseVerifyEmail from '~/components/auth/PleaseVerifyEmail.vue'

const { showSnackbar } = useSnackbar()
const { t } = useI18n()

const email = ref('')
const password = ref('')
const { fetchAuth } = useAuth()
const notVerifiedEmail = ref<boolean>(false)

const onClick = () => {
    login({ email: email.value, password: password.value })
        .then(async () => {
            await fetchAuth()
        })
        .then(() => {
            navigateTo('/home')
        })
        .catch((err) => {
            if (err.message === LOGIN_ERRORS.EMAIL_NOT_VERIFIED) {
                notVerifiedEmail.value = true
            } else {
                showSnackbar(t(`auth.login.errors.${err.message}`))
            }
        })
}
</script>
