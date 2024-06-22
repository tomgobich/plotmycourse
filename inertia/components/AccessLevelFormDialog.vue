<script setup lang="ts">
import AccessLevelDto from '#dtos/access_level'
import { computed, watch } from 'vue'
import { useForm } from '@inertiajs/vue3'
import { Loader } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
  accessLevel?: AccessLevelDto
}>()

const emits = defineEmits(['update:open'])

const internalOpen = computed({
  get: () => props.open,
  set: (value) => emits('update:open', value),
})

const defaultValues = () => ({
  name: props.accessLevel?.name ?? '',
  color: props.accessLevel?.color ?? '#818cf8',
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
  if (props.accessLevel) {
    return form.put(`/access-levels/${props.accessLevel.id}`, { onSuccess })
  }

  form.post(`/access-levels`, { onSuccess })
}

function onSuccess() {
  internalOpen.value = false
}
</script>

<template>
  <Dialog v-model:open="internalOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle v-if="accessLevel">Edit Access Level</DialogTitle>
        <DialogTitle v-else>Add Access Level</DialogTitle>
      </DialogHeader>
      <form id="accessLevelForm" class="grid gap-4 py-4" @submit.prevent="onSubmit">
        <FormInput label="Name" v-model="form.name" :errors="form.errors.name" />
        <FormInput type="color" label="Color" v-model="form.color" :errors="form.errors.color" />
      </form>
      <DialogFooter>
        <Button type="submit" form="accessLevelForm" :disabled="form.processing">
          <Loader v-if="form.processing" class="mr-2 h-4 w-4 animate-spin" />
          <span v-if="accessLevel">Update Access Level</span>
          <span v-else>Add Access Level</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
