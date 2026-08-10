<template>
    <div class="w-full flex flex-col items-center justify-center">
        <Logo class="mt-[80px] mb-[40px] mx-auto" :size="Size.medium" />

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
        <div v-if="isLoading">
            <Loading />
        </div>
        <VButton
            :ariaLabel="t('auth.actions.login')"
            :disabled="!email || !password || isLoading"
            :onClick="onClick"
            >{{ t('auth.actions.login') }}</VButton
        >
        <PleaseVerifyEmail :email="email" v-if="notVerifiedEmail" />
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '#imports'

import { login } from '~/apis/auth'
import { Field, Logo, VButton, Loading } from '~/ui'
import { useSnackbar } from '~/composables/useSnackbar'
import { useAuth } from '~/composables/useAuth'
import { LOGIN_ERRORS } from '~/static/auth'
import PleaseVerifyEmail from '~/components/auth/PleaseVerifyEmail.vue'
import { useCustomRoute } from '~/composables/useCustomRoute'
import { Size } from '~/types'

const { showSnackbar } = useSnackbar()
const { t } = useI18n()
const { goToRoute } = useCustomRoute()

const email = ref('')
const password = ref('')
const { fetchAuth } = useAuth()
const notVerifiedEmail = ref<boolean>(false)
const isLoading = ref<boolean>(false)

const onClick = () => {
    isLoading.value = true
    login({ email: email.value, password: password.value })
        .then(async () => {
            await fetchAuth()
        })
        .then(() => {
            goToRoute('home')
        })
        .catch((err) => {
            if (err.message === LOGIN_ERRORS.EMAIL_NOT_VERIFIED) {
                notVerifiedEmail.value = true
            } else {
                console.error(err)
                showSnackbar(t(`auth.login.errors.${err.message}`))
            }
        })
        .finally(() => {
            isLoading.value = false
        })
}
</script>
