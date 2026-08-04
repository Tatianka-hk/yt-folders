<template>
    <VButton :onClick="onClick">{{ t('menu.buttons.logout') }}</VButton>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { navigateTo } from 'nuxt/app'

import { logout } from '~/apis/auth'

const { t } = useI18n()

const onClick = async () => {
    await logout()
    navigateTo('/')
}
</script>
