<template>
    <SelectInput
        :value="locale"
        :options="langs"
        @change="changeLang($event)"
    />
</template>
<script setup lang="ts">
import { langs, STORAGE_KEY } from '~/static'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const changeLang = (val: string) => {
    locale.value = val
    localStorage.setItem(STORAGE_KEY, val)
}
</script>
