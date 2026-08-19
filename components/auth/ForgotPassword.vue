<template>
    <label class="flex items-start justify-start gap-3 cursor-pointer mb-3">
        <span
            @click="goToRoute('reset-password')"
            class="text-white underline hover:opacity-80"
        >
            {{ t('auth.forgot_password') }} </span
        >.
    </label>
</template>
<script setup lang="ts">
import { useCustomRoute, useI18n } from '#imports'
const { goToRoute } = useCustomRoute()
const { t } = useI18n()
</script>
