<script setup lang="ts">
import { unref, computed, watchEffect, nextTick, ref } from 'vue'
import { toast } from 'vue-sonner'
import { Toaster } from '~/components/ui/sonner'

type Toast = string | Record<string, string>

const props = defineProps<{
  messages: Record<string, any>
}>()

const pendingMessages = ref({ ...props.messages })

nextTick(() =>
  runToasts({
    exceptions: pendingMessages.value?.errorsBag,
    success: pendingMessages.value?.success,
  })
)

watchEffect(() => {
  pendingMessages.value = { ...props.messages }
  runToasts({
    exceptions: pendingMessages.value?.errorsBag,
    success: pendingMessages.value?.success,
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

  pendingMessages.value = {}
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
