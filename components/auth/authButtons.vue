<template>
    <!-- add hover -->
    <UserCircle v-if="isAuthorized" />

    <div class="flex flex-col gap-2" v-else>
        <button
            @click="$router.push('/login')"
            class="bg-primary cursor-pointer py-1 px-2 text-base rounded-[8px] font-julius"
        >
            {{ t('auth.actions.login') }}
        </button>
        <button
            @click="$router.push('/signup')"
            class="bg-blue cursor-pointer py-1 px-2 text-base rounded-[8px] font-julius"
        >
            {{ t('auth.actions.signup') }}
        </button>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { UserCircle } from '~/ui'

const { t } = useI18n()
const isAuthorized = ref(false)
</script>
