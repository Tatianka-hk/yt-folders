<template>
    <div class="min-h-screen flex flex-col">
        <main class="flex-1 flex">
            <slot />
        </main>

        <Footer class="mx-auto mb-4 w-[calc(100%-32px)] max-w-[1440px]" />
    </div>
</template>
<script setup lang="ts">
import Footer from '~/components/Footer.vue'
</script>
