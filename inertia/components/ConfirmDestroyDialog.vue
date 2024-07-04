<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    cancelText?: string
    actionText?: string
    actionHref: string
  }>(),
  {
    cancelText: 'Cancel',
    actionText: 'Delete',
  }
)

const emits = defineEmits(['update:open'])

const internalOpen = computed({
  get: () => props.open,
  set: (value) => emits('update:open', value),
})
</script>

<template>
  <AlertDialog v-model:open="internalOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          <slot />
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{{ cancelText }}</AlertDialogCancel>
        <AlertDialogAction as-child>
          <Link :href="actionHref" method="delete" as="button"> {{ actionText }} </Link>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
