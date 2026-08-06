<template>
    <SelectInput
        :value="locale"
        :options="langs"
        @change="changeLang($event as AppLocale)"
    />
</template>
<script setup lang="ts">
import { langs, STORAGE_KEY } from '~/static'

const { locale, setLocale } = useI18n()
const changeLang = (val: AppLocale) => {
    setLocale(val as AppLocale)
    localStorage.setItem(STORAGE_KEY, val)
}
</script>
