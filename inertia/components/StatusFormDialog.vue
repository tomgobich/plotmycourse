<script setup lang="ts">
import StatusDto from '#dtos/status'
import { computed, watch } from 'vue'
import { useForm } from '@inertiajs/vue3'
import { Loader } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
  status?: StatusDto
}>()

const emits = defineEmits(['update:open'])

const internalOpen = computed({
  get: () => props.open,
  set: (value) => emits('update:open', value),
})

const defaultValues = () => ({
  name: props.status?.name ?? '',
  color: props.status?.color ?? '#818cf8',
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
  if (props.status) {
    return form.put(`/statuses/${props.status.id}`, { onSuccess })
  }

  form.post(`/statuses`, { onSuccess })
}

function onSuccess() {
  internalOpen.value = false
}
</script>

<template>
  <Dialog v-model:open="internalOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle v-if="status">Edit Status</DialogTitle>
        <DialogTitle v-else>Add Status</DialogTitle>
      </DialogHeader>
      <form id="statusForm" class="grid gap-4 py-4" @submit.prevent="onSubmit">
        <FormInput label="Name" v-model="form.name" :errors="form.errors.name" />
        <FormInput type="color" label="Color" v-model="form.color" :errors="form.errors.color" />
      </form>
      <DialogFooter>
        <Button type="submit" form="statusForm" :disabled="form.processing">
          <Loader v-if="form.processing" class="mr-2 h-4 w-4 animate-spin" />
          <span v-if="status">Update Status</span>
          <span v-else>Add Status</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
