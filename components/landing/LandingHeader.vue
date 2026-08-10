<template>
    <header
        class="relative z-20 flex w-full items-center justify-between gap-3"
    >
        <LanguageInput />

        <AuthButtons />
    </header>
</template>
<script setup lang="ts">
import { AuthButtons, LanguageInput } from '~/components'
</script>
