<script setup lang="ts">
import StatusDto from '#dtos/status'
import { Plus } from 'lucide-vue-next'
import { watchEffect, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import { useResourceActions } from '~/composables/resource_actions'
import OrganizationDto from '../../../app/dtos/organization'

const props = defineProps<{
  statuses: StatusDto[]
  organization: OrganizationDto
}>()

const list = ref(props.statuses)
const { form, dialog, destroy, onSuccess } = useResourceActions<StatusDto>()({
  name: '',
  color: '#818cf8',
})

watchEffect(() => {
  list.value = props.statuses
})

function onEdit(resource: StatusDto) {
  dialog.value.open(resource, {
    name: resource.name,
    color: resource.color,
  })
}

function onSubmit() {
  const id = dialog.value.resource?.id

  if (id) {
    return form.put(`/statuses/${id}`, { onSuccess })
  }

  form.post('/statuses', { onSuccess })
}

function onOrderUpdate() {
  const ids = list.value.map((status) => status.id)
  router.put('/statuses/order', { ids }, { preserveScroll: true })
}
</script>

<template>
  <AppHead title="Statuses" :description="`Manage the statuses of ${organization.name}`" />

  <div class="w-full max-w-2xl mx-auto bg-background border rounded-xl p-4">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold px-4">Statuses</h1>

      <Button @click="dialog.open()" size="sm" variant="ghost">
        <Plus class="w-3 h-3 mr-2" />
        Add Status
      </Button>
    </div>

    <SortableResourceItem
      v-model="list"
      @end="onOrderUpdate"
      @edit="onEdit"
      @destroy="destroy.open"
    />

    <FormDialog
      resource="Status"
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
      title="Delete Status?"
      :action-href="`/statuses/${destroy.resource?.id}`"
    >
      Are you sure you'd like to delete your
      <strong>{{ destroy.resource?.name }}</strong> status? Any series or lesson using
      {{ destroy.resource?.name }} will have their status cleared.
    </ConfirmDestroyDialog>
  </div>
</template>
