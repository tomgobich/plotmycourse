<script setup lang="ts">
import AccessLevelDto from '#dtos/access_level'
import { Plus } from 'lucide-vue-next'
import { watchEffect, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import { useResourceActions } from '~/composables/resource_actions'

const props = defineProps<{
  accessLevels: AccessLevelDto[]
}>()

const list = ref(props.accessLevels)
const { form, dialog, destroy, onSuccess } = useResourceActions<AccessLevelDto>()({
  name: '',
  color: '#818cf8',
})

watchEffect(() => {
  list.value = props.accessLevels
})

function onEdit(resource: AccessLevelDto) {
  dialog.value.open(resource, {
    name: resource.name,
    color: resource.color,
  })
}

function onSubmit() {
  const id = dialog.value.resource?.id

  if (id) {
    return form.put(`/access-levels/${id}`, { onSuccess })
  }

  form.post('/access-levels', { onSuccess })
}

function onOrderUpdate() {
  const ids = list.value.map((accessLevel) => accessLevel.id)
  router.put('/access-levels/order', { ids })
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto bg-background border rounded-xl p-4">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold px-4">Access Levels</h1>

      <Button @click="dialog.open()" size="sm" variant="ghost">
        <Plus class="w-3 h-3 mr-2" />
        Add Access Level
      </Button>
    </div>

    <Sortable v-model="list" class="flex flex-col" @end="onOrderUpdate">
      <template #item="{ element }">
        <SortableResourceItem :element="element" @edit="onEdit" @destroy="destroy.open" />
      </template>
    </Sortable>

    <FormDialog
      resource="Access Level"
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
      title="Delete Access Level?"
      :action-href="`/access-levels/${destroy.resource?.id}`"
    >
      Are you sure you'd like to delete your
      <strong>{{ destroy.resource?.name }}</strong> access level? Any series using
      {{ destroy.resource?.name }} will have their access level cleared.
    </ConfirmDestroyDialog>
  </div>
</template>
