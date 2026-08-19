<template>
    <div class="w-full min-h-screen flex items-center justify-center px-4">
        <div class="w-full max-w-[600px] flex flex-col gap-6">
            <div>
                <h1 class="text-2xl font-semibold text-white">
                    {{ t('support.title') }}
                </h1>

                <p class="text-text mt-2">
                    {{ t('support.description') }}
                </p>
            </div>

            <form class="flex flex-col gap-4" @submit.prevent="submit">
                <Field
                    v-model="email"
                    type="email"
                    name="email"
                    :label="t('support.email')"
                />

                <div class="flex flex-col gap-2">
                    <label class="text-text">
                        {{ t('support.message') }}
                    </label>

                    <textarea
                        v-model="message"
                        :placeholder="t('support.messagePlaceholder')"
                        rows="6"
                        class="w-full resize-none rounded-lg border border-secondary/30 bg-background px-4 py-3 text-text outline-none focus:border-primary"
                    />
                </div>

                <VButton
                    :ariaLabel="t('support.submit')"
                    :disabled="loading"
                    :onClick="submit"
                >
                    {{ loading ? t('support.sending') : t('support.submit') }}
                </VButton>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'
import { sendSupport } from '~/apis/support'
import { isValidEmail } from '~/utils/auth'
const { t } = useI18n()

const email = ref('')
const message = ref('')
const loading = ref(false)
const { showSnackbar } = useSnackbar()

const submit = async () => {
    if (!email.value || !message.value.trim()) {
        showSnackbar(t('support.fieldsRequired'), 'error')
        return
    }
    if (!isValidEmail(email.value)) {
        showSnackbar(t('auth.errors.email_invalid'), 'error')
        return
    }

    loading.value = true

    try {
        await sendSupport({
            email: email.value,
            message: message.value,
        })
        showSnackbar(t('support.success'), 'success')

        email.value = ''
        message.value = ''
    } catch (error: any) {
        const message = error?.data?.message || t('support.error')

        showSnackbar(message, 'error')
    } finally {
        loading.value = false
    }
}
</script>
