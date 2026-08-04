<template>
    <VButton :onClick="onClick">{{ t('menu.buttons.logout') }}</VButton>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { navigateTo } from 'nuxt/app'

import { logout } from '~/apis/auth'
import { useAuth } from '~/composables/useAuth'
import { useSnackbar } from '~/composables/useSnackbar'

const { t } = useI18n()
const { showSnackbar } = useSnackbar()
const { fetchAuth } = useAuth()

const onClick = async () => {
    try {
        await logout()
        await fetchAuth()
        navigateTo('/')
    } catch (e) {
        showSnackbar(t('somethingWentWrong'), 'error')
    }
}
</script>
