<template>
    <main class="w-full overflow-hidden bg-background text-text">
        <div
            class="mx-auto flex w-full max-w-[1600px] flex-col px-5 pt-5 sm:px-8 sm:pt-5 lg:px-12"
        >
            <LandingHeader />

            <section
                class="relative flex flex-1 flex-col lg:grid lg:grid-cols-[1fr_0.9fr] lg:items-start lg:gap-14 xl:gap-20"
            >
                <div class="relative z-10">
                    <LandingHero />

                    <div class="mt-10 lg:mt-14">
                        <LandingSteps />
                    </div>
                </div>

                <div
                    class="relative flex justify-center lg:mt-0 lg:justify-end hidden lg:block -top-[80px]"
                >
                    <LandingPreview />
                </div>
            </section>
        </div>
    </main>
</template>

<script setup lang="ts">
import {
    LandingHeader,
    LandingHero,
    LandingPreview,
    LandingSteps,
} from '~/components/landing'
</script>
