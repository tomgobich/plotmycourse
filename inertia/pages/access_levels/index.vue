<script setup lang="ts">
import AccessLevelDto from '#dtos/access_level'
import { Plus } from 'lucide-vue-next'
import { watchEffect, ref, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import { useResourceActions } from '~/composables/resource_actions'
import OrganizationDto from '#dtos/organization'

const props = defineProps<{
  accessLevels: AccessLevelDto[]
  organization: OrganizationDto
}>()

const list = ref(props.accessLevels)
const { form, dialog, destroy, onSuccess } = useResourceActions<AccessLevelDto>()({
  name: '',
  color: '#818cf8',
})

const destroyReplacementOptions = computed(() =>
  props.accessLevels.filter((level) => level.id !== destroy.value.resource?.id)
)

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

function onDestroyShow(resource: AccessLevelDto) {
  destroy.value.open(resource, {
    replacementId: props.accessLevels.find((level) => level.id !== resource.id)?.id.toString(),
  })
}

function onOrderUpdate() {
  const ids = list.value.map((accessLevel) => accessLevel.id)
  router.put('/access-levels/order', { ids }, { preserveScroll: true })
}
</script>

<template>
  <AppHead
    title="Access Levels"
    :description="`Manage the access levels of ${organization.name}`"
  />

  <div class="w-full max-w-2xl mx-auto bg-background border rounded-xl p-4">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold px-4">Access Levels</h1>

      <Button @click="dialog.open()" size="sm" variant="ghost">
        <Plus class="w-3 h-3 mr-2" />
        Add Access Level
      </Button>
    </div>

    <SortableResourceItem
      v-model="list"
      @end="onOrderUpdate"
      @edit="onEdit"
      @destroy="onDestroyShow"
    />

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
      :action-data="destroy.data"
    >
      <div v-if="destroy.resource?.meta.courses_count || destroy.resource?.meta.lessons_count">
        What access level would you like to assign the courses &amp; lessons using
        {{ destroy.resource?.name }}?

        <FormInput
          label="Access Level"
          type="select"
          v-model="destroy.data.replacementId"
          class="mt-4"
        >
          <SelectItem
            v-for="level in destroyReplacementOptions"
            :key="level.id"
            :value="level.id.toString()"
          >
            {{ level.name }}
          </SelectItem>
        </FormInput>
      </div>
      <div v-else>
        Are you sure you'd like to delete your
        <strong>{{ destroy.resource?.name }}</strong> access level? No courses or lessons are
        currently using it.
      </div>
    </ConfirmDestroyDialog>
  </div>
</template>
