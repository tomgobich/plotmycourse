<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { toast } from 'vue-sonner'
import { Toaster } from '~/components/ui/sonner'

const props = defineProps<{
  messages: Record<string, any>
}>()

const exceptions = computed(() => props.messages?.errorsBag || {})
const success = computed(() => props.messages?.success || {})

watchEffect(() => {
  if (Object.values(exceptions.value).length) {
    toast.error('An error occurred', {
      description:
        typeof exceptions.value === 'string'
          ? exceptions.value
          : Object.values(exceptions.value).join(', '),
    })
  }
})

watchEffect(() => {
  if (Object.values(success.value).length) {
    toast.success(
      typeof success.value === 'string' ? success.value : Object.values(success.value).join(', ')
    )
  }
})
</script>

<template>
  <Toaster class="pointer-events-auto" rich-colors />
</template>
