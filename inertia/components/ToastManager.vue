<script setup lang="ts">
import { unref, computed, watchEffect, nextTick } from 'vue'
import { toast } from 'vue-sonner'
import { Toaster } from '~/components/ui/sonner'

type Toast = string | Record<string, string>

const props = defineProps<{
  messages: Record<string, any>
}>()

const exceptions = computed(() => props.messages?.errorsBag)
const success = computed(() => props.messages?.success)

nextTick(() =>
  runToasts({
    exceptions: exceptions.value,
    success: success.value,
  })
)

watchEffect(() => {
  runToasts({
    exceptions: exceptions.value,
    success: success.value,
  })
})

function runToasts(toasts: { exceptions: Toast; success: Toast }) {
  const exceptions = getToastMessage(unref(toasts.exceptions))
  const success = getToastMessage(unref(toasts.success))

  if (exceptions.length) {
    toast.error('An error occurred', {
      description: exceptions,
    })
  }

  if (success.length) {
    toast.success(success)
  }
}

function getToastMessage(toast: Toast) {
  if (typeof toast === 'string') return toast
  if (typeof toast === 'object') return Object.values(toast).join(', ')

  return ''
}
</script>

<template>
  <Toaster class="pointer-events-auto" rich-colors />
</template>
