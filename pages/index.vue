<template>
    <div
        class="flex w-full items-center justify-between mb-[40px] gap-[20px] pr-[40px] pt-[40px]"
    >
        <LanguageInput />
        <!-- <UserCircle v-if="isAuth" /> -->
        <AuthButtons />
    </div>
    <Logo />
</template>
<script setup lang="ts">
import { Logo } from '../ui'
</script>
