<template>
    <div class="flex flex-col items-center text-center text-text">
        <h1 class="font-julius text-2xl mb-4">
            {{ t('auth.verify_email.sent.title') }}
        </h1>

        <p class="text-base mb-2">
            {{ t('auth.verify_email.sent.description') }}
        </p>

        <p v-if="email" class="font-semibold mb-8">
            {{ email }}
        </p>

        <VButton
            :disabled="isSending || secondsLeft > 0"
            :onClick="resendVerificationEmail"
        >
            <span v-if="isSending">
                {{ t('auth.verify_email.resend.sending') }}
            </span>

            <span v-else-if="secondsLeft > 0">
                {{
                    t('auth.verify_email.resend.available_in', {
                        seconds: secondsLeft,
                    })
                }}
            </span>

            <span v-else>
                {{ t('auth.verify_email.resend.button') }}
            </span>
        </VButton>

        <p v-if="successMessage" class="mt-4 text-sm">
            {{ successMessage }}
        </p>

        <p v-if="errorMessage" class="mt-4 text-sm text-red-600">
            {{ errorMessage }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { resendVerification } from '~/apis/auth'
import { VButton } from '~/ui'

const RESEND_DELAY_SECONDS = 60
const RESEND_STORAGE_KEY = 'verification-email-resend-at'

const { t, locale } = useI18n()

const props = defineProps<{
    email?: string
}>()

const isSending = ref(false)
const secondsLeft = ref(0)
const successMessage = ref('')
const errorMessage = ref('')

let timer: ReturnType<typeof setInterval> | null = null

function updateSecondsLeft() {
    const resendAt = Number(localStorage.getItem(RESEND_STORAGE_KEY))

    if (!resendAt) {
        secondsLeft.value = 0
        stopTimer()
        return
    }

    const difference = resendAt - Date.now()

    if (difference <= 0) {
        secondsLeft.value = 0
        localStorage.removeItem(RESEND_STORAGE_KEY)
        stopTimer()
        return
    }

    secondsLeft.value = Math.ceil(difference / 1000)
}

function startTimer() {
    stopTimer()
    updateSecondsLeft()

    if (secondsLeft.value <= 0) {
        return
    }

    timer = setInterval(updateSecondsLeft, 1000)
}

function stopTimer() {
    if (!timer) {
        return
    }

    clearInterval(timer)
    timer = null
}

function startCooldown() {
    const resendAt = Date.now() + RESEND_DELAY_SECONDS * 1000

    localStorage.setItem(RESEND_STORAGE_KEY, resendAt.toString())

    startTimer()
}

async function resendVerificationEmail() {
    if (isSending.value || secondsLeft.value > 0) {
        return
    }

    try {
        isSending.value = true
        successMessage.value = ''
        errorMessage.value = ''

        await resendVerification({
            email: props.email as string,
            locale: locale.value,
        })

        successMessage.value = t('auth.verify_email.resend.success')

        startCooldown()
    } catch (error) {
        console.error('Resend verification email error:', error)

        errorMessage.value = t('auth.verify_email.resend.error')
    } finally {
        isSending.value = false
    }
}

onMounted(() => {
    startTimer()
})

onBeforeUnmount(() => {
    stopTimer()
})
</script>
