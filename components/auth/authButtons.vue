<template>
    <!-- add hover -->
    <UserCircle v-if="isAuthorized" />

    <div class="flex flex-col gap-2" v-else>
        <button
            :ariaLabel="t('auth.actions.login')"
            @click="goToRoute('login')"
            class="bg-primary cursor-pointer py-1 px-2 text-base rounded-[8px] font-julius text-text"
        >
            {{ t('auth.actions.login') }}
        </button>
        <button
            :ariaLabel="t('auth.actions.signup')"
            @click="goToRoute('signup')"
            class="bg-secondary cursor-pointer py-1 px-2 text-base rounded-[8px] font-julius text-text"
        >
            {{ t('auth.actions.signup') }}
        </button>
    </div>
</template>
<script setup lang="ts">
import { useCustomRoute, useI18n } from '#imports'
import { ref } from 'vue'

import { UserCircle } from '~/ui'

const { t } = useI18n()
const isAuthorized = ref(false)
const { goToRoute } = useCustomRoute()
</script>
