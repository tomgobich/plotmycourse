<script setup lang="ts">
import DifficultyDto from '#dtos/difficulty'
import { Plus } from 'lucide-vue-next'
import { watchEffect, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import { useResourceActions } from '~/composables/resource_actions'

const props = defineProps<{
  difficulties: DifficultyDto[]
}>()

const list = ref(props.difficulties)
const { form, dialog, destroy, onSuccess } = useResourceActions<DifficultyDto>()({
  name: '',
  color: '#818cf8',
})

watchEffect(() => {
  list.value = props.difficulties
})

function onEdit(resource: DifficultyDto) {
  dialog.value.open(resource, {
    name: resource.name,
    color: resource.color,
  })
}

function onSubmit() {
  const id = dialog.value.resource?.id

  if (id) {
    return form.put(`/difficulties/${id}`, { onSuccess })
  }

  form.post('/difficulties', { onSuccess })
}

function onOrderUpdate() {
  const ids = list.value.map((difficulty) => difficulty.id)
  router.put('/difficulties/order', { ids })
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto bg-background border rounded-xl p-4">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold px-4">Difficulties</h1>

      <Button @click="dialog.open()" size="sm" variant="ghost">
        <Plus class="w-3 h-3 mr-2" />
        Add Difficulty
      </Button>
    </div>

    <SortableResourceItem
      v-model="list"
      @end="onOrderUpdate"
      @edit="onEdit"
      @destroy="destroy.open"
    />

    <FormDialog
      resource="Difficulty"
      v-model:open="dialog.isOpen"
      :processing="form.processing"
      :editing="dialog.resource?.id"
      @submit="onSubmit"
    >
      <FormInput label="Name" v-model="form.name" :errors="form.errors.name" />
      <FormInput type="color" label="Color" v-model="form.color" :errors="form.errors.color" />
    </FormDialog>

    <ConfirmDestroyDialog
      v-model:open="destroy.isOpen"
      title="Delete Difficulty?"
      :action-href="`/difficulties/${destroy.resource?.id}`"
    >
      Are you sure you'd like to delete your
      <strong>{{ destroy.resource?.name }}</strong> difficulty? Any series using
      {{ destroy.resource?.name }} will have their difficulty cleared.
    </ConfirmDestroyDialog>
  </div>
</template>
