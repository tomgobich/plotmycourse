<script setup lang="ts">
import StatusDto from '#dtos/status'
import { GripVertical, Pencil, Trash2, Plus } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { watch, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import Sortable from "~/components/Sortable.vue";
import StatusFormDialog from "~/components/StatusFormDialog.vue";
import ConfirmDestroyDialog from "~/components/ConfirmDestroyDialog.vue";

const props = defineProps<{
  statuses: StatusDto[]
}>()

const statuses = ref(props.statuses)

const form = ref<{ open: boolean; status?: StatusDto }>({
  open: false,
  status: undefined,
})

const destroy = ref<{ open: boolean; status?: StatusDto }>({
  open: false,
  status: undefined,
})

watch(
  () => props.statuses,
  (diffs) => (statuses.value = diffs)
)

function onOrderUpdate() {
  const ids = statuses.value.map((status) => status.id)
  router.put('/statuses/order', { ids })
}

function onCreate() {
  form.value.status = undefined
  form.value.open = true
}

function onEdit(status: StatusDto) {
  form.value.status = status
  form.value.open = true
}

function onDestroy(status: StatusDto) {
  destroy.value.status = status
  destroy.value.open = true
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto bg-background border rounded-xl p-4">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold px-4">Statuses</h1>

      <Button @click="onCreate" size="sm" variant="ghost">
        <Plus class="w-3 h-3 mr-2" />
        Add Status
      </Button>
    </div>

    <Sortable v-model="statuses" class="flex flex-col" @end="onOrderUpdate">
      <template #item="{ element }">
        <li
          class="flex items-center justify-between rounded-md px-3 py-1.5 hover:bg-slate-100 duration-300 group draggable"
        >
          <div class="flex items-center gap-4">
            <div class="text-slate-300 group-hover:text-slate-950 duration-300 handle cursor-move">
              <GripVertical class="w-4 h-4" />
            </div>
            <div
              class="w-3 h-3 rounded-full bg-slate-100"
              :style="`background-color: ${element.color}`"
            ></div>
            <span class="font-bold">{{ element.name }}</span>
            <span v-if="element.isDefault" class="text-sm text-slate-400">(Default)</span>
          </div>
          <div class="flex gap-2 opacity-0 group-hover:opacity-100 duration-300">
            <Button size="xs" @click="onEdit(element)">
              <Pencil class="w-3 h-3" />
            </Button>
            <Button variant="destructive" size="xs" @click="onDestroy(element)">
              <Trash2 class="w-3 h-3" />
            </Button>
          </div>
        </li>
      </template>
    </Sortable>

    <StatusFormDialog v-model:open="form.open" :status="form.status" />
    <ConfirmDestroyDialog
      v-model:open="destroy.open"
      title="Delete Status?"
      :action-href="`/statuses/${destroy.status?.id}`"
    >
      Are you sure you'd like to delete your
      <strong>{{ destroy.status?.name }}</strong> status? Any series or lesson using
      {{ destroy.status?.name }} will have their status cleared.
    </ConfirmDestroyDialog>
  </div>
</template>
