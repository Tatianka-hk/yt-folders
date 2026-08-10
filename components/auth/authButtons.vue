<template>
    <!-- add hover -->
    <UserCircle v-if="isAuthorized" />

    <div class="flex flex-col gap-2 w-[200px] hidden lg:flex" v-else>
        <VButton :onClick="() => goToRoute('login')" extraClass="!py-2">
            {{ t('auth.actions.login') }}
        </VButton>
        <VButton
            :onClick="() => goToRoute('signup')"
            :variant="BUTTON_VARIANT.SECONDARY"
            extraClass="!py-2"
        >
            {{ t('auth.actions.signup') }}
        </VButton>
    </div>
</template>
<script setup lang="ts">
import { useCustomRoute, useI18n } from '#imports'
import { ref } from 'vue'
import { BUTTON_VARIANT } from '~/static'

import { UserCircle, VButton } from '~/ui'

const { t } = useI18n()
const isAuthorized = ref(false)
const { goToRoute } = useCustomRoute()
</script>
