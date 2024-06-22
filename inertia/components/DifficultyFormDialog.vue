<script setup lang="ts">
import DifficultyDto from '#dtos/difficulty'
import { computed, watch } from 'vue'
import { useForm } from '@inertiajs/vue3'
import { Loader } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
  difficulty?: DifficultyDto
}>()

const emits = defineEmits(['update:open'])

const internalOpen = computed({
  get: () => props.open,
  set: (value) => emits('update:open', value),
})

const defaultValues = () => ({
  name: props.difficulty?.name ?? '',
  color: props.difficulty?.color ?? '#818cf8',
})

const form = useForm(defaultValues())

watch(
  () => props.open,
  () => {
    form.defaults(defaultValues())
    form.reset()
  }
)

function onSubmit() {
  if (props.difficulty) {
    return form.put(`/difficulties/${props.difficulty.id}`, { onSuccess })
  }

  form.post(`/difficulties`, { onSuccess })
}

function onSuccess() {
  internalOpen.value = false
}
</script>

<template>
  <Dialog v-model:open="internalOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle v-if="difficulty">Edit Difficulty</DialogTitle>
        <DialogTitle v-else>Add Difficulty</DialogTitle>
      </DialogHeader>
      <form id="difficultyForm" class="grid gap-4 py-4" @submit.prevent="onSubmit">
        <FormInput label="Name" v-model="form.name" :errors="form.errors.name" />
        <FormInput type="color" label="Color" v-model="form.color" :errors="form.errors.color" />
      </form>
      <DialogFooter>
        <Button type="submit" form="difficultyForm" :disabled="form.processing">
          <Loader v-if="form.processing" class="mr-2 h-4 w-4 animate-spin" />
          <span v-if="difficulty">Update Difficulty</span>
          <span v-else>Add Difficulty</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
