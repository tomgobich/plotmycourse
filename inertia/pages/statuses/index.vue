<script setup lang="ts">
import StatusDto from '#dtos/status'
import { Plus } from 'lucide-vue-next'
import { watch, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import { useSortableResource } from '~/composables/sortable_resource'

const props = defineProps<{
  statuses: StatusDto[]
}>()

const { model, form, destroying, open } = useSortableResource(props.statuses)

watch(
  () => props.statuses,
  (diffs) => (statuses.value = diffs)
)

function onOrderUpdate() {
  const ids = statuses.value.map((status) => status.id)
  router.put('/statuses/order', { ids })
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto bg-background border rounded-xl p-4">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold px-4">Statuses</h1>

      <Button @click="open.create" size="sm" variant="ghost">
        <Plus class="w-3 h-3 mr-2" />
        Add Status
      </Button>
    </div>

    <Sortable v-model="model" class="flex flex-col" @end="onOrderUpdate">
      <template #item="{ element }">
        <SortableResourceItem :element="element" @edit="open.edit" @destroy="open.destroy" />
      </template>
    </Sortable>

    <StatusFormDialog v-model:open="form.open" :status="form.resource" />
    <ConfirmDestroyDialog
      v-model:open="destroying.open"
      title="Delete Status?"
      :action-href="`/statuses/${destroying.resource?.id}`"
    >
      Are you sure you'd like to delete your
      <strong>{{ destroying.resource?.name }}</strong> status? Any series or lesson using
      {{ destroying.resource?.name }} will have their status cleared.
    </ConfirmDestroyDialog>
  </div>
</template>
