<script setup lang="ts">
import DifficultyDto from '#dtos/difficulty'
import { computed } from 'vue'

const props = defineProps<{
  open: boolean
  difficulty?: DifficultyDto
}>()

const emits = defineEmits(['update:open'])

const internalOpen = computed({
  get: () => props.open,
  set: (value) => emits('update:open', value),
})
</script>

<template>
  <Dialog v-model:open="internalOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle v-if="difficulty">Edit Difficulty</DialogTitle>
        <DialogTitle v-else>Add Difficulty</DialogTitle>

        <DialogDescription v-if="difficulty">
          You are editing {{ difficulty.name }}
        </DialogDescription>
        <DialogDescription v-else> You are adding a brand new difficulty </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4"></div>
      <DialogFooter>
        <Button v-if="difficulty" type="submit"> Update Difficulty </Button>
        <Button v-else type="submit"> Add Difficulty </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
