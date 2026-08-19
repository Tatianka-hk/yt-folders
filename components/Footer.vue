<template>
    <footer class="w-full rounded-xl bg-background shadow-lg">
        <div
            class="flex flex-col gap-6 px-6 pt-6 sm:flex-row sm:items-center sm:justify-between lg:px-10"
        >
            <NuxtLink to="/" class="flex items-center">
                <Logo :size="Size.small" />
            </NuxtLink>

            <nav
                class="flex flex-wrap items-center gap-4 text-sm text-text/80 sm:gap-0 sm:text-base"
            >
                <span
                    @click="goToRoute('terms')"
                    class="transition-colors hover:text-primary sm:px-6"
                >
                    /terms
                </span>

                <span class="hidden h-8 w-px bg-text/20 sm:block" />

                <span
                    @click="goToRoute('policy')"
                    class="transition-colors hover:text-primary sm:px-6"
                >
                    /policy
                </span>

                <span class="hidden h-8 w-px bg-text/20 sm:block" />

                <span
                    @click="goToRoute('support')"
                    class="transition-colors hover:text-primary sm:px-6"
                >
                    /support
                </span>
            </nav>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { Size } from '~/types'
const { goToRoute } = useCustomRoute()
</script>
