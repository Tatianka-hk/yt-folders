<template>
    <div>
        <Slogan />
        {{ $t('failedToLoad') }}
    </div>
</template>
<script setup lang="ts">
import { Slogan } from '../ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
