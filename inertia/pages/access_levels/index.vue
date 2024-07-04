<script setup lang="ts">
import AccessLevelDto from '#dtos/access_level'
import { Plus } from 'lucide-vue-next'
import { watch, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import { useSortableResource } from '~/composables/sortable_resource'

const props = defineProps<{
  accessLevels: AccessLevelDto[]
}>()

const { model, form, destroying, open } = useSortableResource(props.accessLevels)

watch(
  () => props.accessLevels,
  (value) => (model.value = value)
)

function onOrderUpdate() {
  const ids = model.value.map((accessLevel) => accessLevel.id)
  router.put('/access-levels/order', { ids })
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto bg-background border rounded-xl p-4">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold px-4">Access Levels</h1>

      <Button @click="open.create" size="sm" variant="ghost">
        <Plus class="w-3 h-3 mr-2" />
        Add Access Level
      </Button>
    </div>

    <Sortable v-model="model" class="flex flex-col" @end="onOrderUpdate">
      <template #item="{ element }">
        <SortableResourceItem :element="element" @edit="open.edit" @destroy="open.destroy" />
      </template>
    </Sortable>

    <AccessLevelFormDialog v-model:open="form.open" :access-level="form.resource" />
    <ConfirmDestroyDialog
      v-model:open="destroying.open"
      title="Delete Access Level?"
      :action-href="`/access-levels/${destroying.resource?.id}`"
    >
      Are you sure you'd like to delete your
      <strong>{{ destroying.resource?.name }}</strong> access level? Any series using
      {{ destroying.resource?.name }} will have their access level cleared.
    </ConfirmDestroyDialog>
  </div>
</template>
