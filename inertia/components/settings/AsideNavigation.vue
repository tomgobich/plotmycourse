<script setup lang="ts">
import { Abilities } from '#actions/abilities/get_abilities'

defineProps<{ can: Abilities }>()
</script>

<template>
  <nav class="grid gap-4 text-sm text-muted-foreground">
    <Link href="/settings/account" class="font-semibold text-primary"> Account </Link>
    <Link
      v-if="can.organization.edit"
      href="/settings/organization"
      class="font-semibold text-primary"
    >
      Organization
    </Link>
  </nav>
</template>
