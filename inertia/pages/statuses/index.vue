<script setup lang="ts">
import StatusDto from '#dtos/status'
import { Plus } from 'lucide-vue-next'
import { watchEffect, ref, computed } from 'vue'
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

const destroyReplacementOptions = computed(() =>
  props.statuses.filter((status) => status.id !== destroy.value.resource?.id)
)

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

function onDestroyShow(resource: StatusDto) {
  destroy.value.open(resource, {
    replacementId: props.statuses.find((status) => status.id !== resource.id)?.id.toString(),
  })
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
      @destroy="onDestroyShow"
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
      :action-data="destroy.data"
    >
      <div
        v-if="
          destroy.resource?.meta.courses_count ||
          destroy.resource?.meta.modules_count ||
          destroy.resource?.meta.lessons_count
        "
      >
        What status would you like to assign the courses, modules, and lessons using
        {{ destroy.resource?.name }}?

        <FormInput label="Status" type="select" v-model="destroy.data.replacementId" class="mt-4">
          <SelectItem
            v-for="status in destroyReplacementOptions"
            :key="status.id"
            :value="status.id.toString()"
          >
            {{ status.name }}
          </SelectItem>
        </FormInput>
      </div>
      <div v-else>
        Are you sure you'd like to delete your
        <strong>{{ destroy.resource?.name }}</strong> status? No courses, modules, or lessons are
        currently using it.
      </div>
    </ConfirmDestroyDialog>
  </div>
</template>
