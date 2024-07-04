<script setup lang="ts">
import DifficultyDto from '#dtos/difficulty'
import { Plus } from 'lucide-vue-next'
import { watch, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import { useSortableResource } from '~/composables/sortable_resource'

const props = defineProps<{
  difficulties: DifficultyDto[]
}>()

const { model, form, destroying, open } = useSortableResource(props.difficulties)

watch(
  () => props.difficulties,
  (value) => (difficulties.value = value)
)

function onOrderUpdate() {
  const ids = difficulties.value.map((difficulty) => difficulty.id)
  router.put('/difficulties/order', { ids })
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto bg-background border rounded-xl p-4">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold px-4">Difficulties</h1>

      <Button @click="open.create" size="sm" variant="ghost">
        <Plus class="w-3 h-3 mr-2" />
        Add Difficulty
      </Button>
    </div>

    <Sortable v-model="model" class="flex flex-col" @end="onOrderUpdate">
      <template #item="{ element }">
        <SortableResourceItem :element="element" @edit="open.edit" @destroy="open.destroy" />
      </template>
    </Sortable>

    <DifficultyFormDialog v-model:open="form.open" :difficulty="form.resource" />
    <ConfirmDestroyDialog
      v-model:open="destroying.open"
      title="Delete Difficulty?"
      :action-href="`/difficulties/${destroying.resource?.id}`"
    >
      Are you sure you'd like to delete your
      <strong>{{ destroying.resource?.name }}</strong> difficulty? Any series using
      {{ destroying.resource?.name }} will have their difficulty cleared.
    </ConfirmDestroyDialog>
  </div>
</template>
