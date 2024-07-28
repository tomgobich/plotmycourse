<script setup lang="ts">
import { Abilities } from '#actions/abilities/get_abilities'

defineProps<{ can: Abilities }>()
</script>

<template>
  <nav class="grid text-sm text-muted-foreground -mx-2">
    <Link
      href="/settings/profile"
      class="link"
      :class="{ active: $page.component === 'settings/profile' }"
    >
      Profile
    </Link>
    <Link
      href="/settings/account"
      class="link"
      :class="{ active: $page.component === 'settings/account' }"
    >
      Account
    </Link>
    <Link
      v-if="can.organization.edit"
      href="/settings/organization"
      class="link"
      :class="{ active: $page.component === 'settings/organization' }"
    >
      Organization
    </Link>
  </nav>
</template>

<style scoped>
.link {
  @apply font-semibold p-2 rounded text-primary m-px;

  &.active {
    @apply m-0 border bg-white shadow-sm;
  }
}
</style>
