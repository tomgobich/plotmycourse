<script setup lang="ts">
import DifficultyDto from '#dtos/difficulty'
import { computed } from 'vue'

const props = defineProps<{
  open: boolean
  difficulty: DifficultyDto
}>()

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
        <AlertDialogTitle>Delete Diffuculty?</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you'd like to delete your <strong>{{ difficulty.name }}</strong> difficulty?
          Any series using {{ difficulty.name }} will have their difficulty cleared.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction as-child>
          <Link :href="`/difficulties/${difficulty.id}`" method="delete" as="button"> Delete </Link>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
