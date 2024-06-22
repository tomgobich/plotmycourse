<script setup lang="ts">
import AccessLevelDto from '#dtos/access_level'
import { GripVertical, Pencil, Trash2, Plus } from 'lucide-vue-next'
import { watch, ref } from 'vue'
import { router } from '@inertiajs/vue3'

const props = defineProps<{
  accessLevels: AccessLevelDto[]
}>()

const accessLevels = ref(props.accessLevels)

const form = ref<{ open: boolean; accessLevel?: AccessLevelDto }>({
  open: false,
  accessLevel: undefined,
})

const destroy = ref<{ open: boolean; accessLevel?: AccessLevelDto }>({
  open: false,
  accessLevel: undefined,
})

watch(
  () => props.accessLevels,
  (diffs) => (accessLevels.value = diffs)
)

function onOrderUpdate() {
  const ids = accessLevels.value.map((accessLevel) => accessLevel.id)
  router.put('/access-levels/order', { ids })
}

function onCreate() {
  form.value.accessLevel = undefined
  form.value.open = true
}

function onEdit(accessLevel: AccessLevelDto) {
  form.value.accessLevel = accessLevel
  form.value.open = true
}

function onDestroy(accessLevel: AccessLevelDto) {
  destroy.value.accessLevel = accessLevel
  destroy.value.open = true
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto bg-background border rounded-xl p-4">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold px-4">Access Levels</h1>

      <Button @click="onCreate" size="sm" variant="ghost">
        <Plus class="w-3 h-3 mr-2" />
        Add Access Level
      </Button>
    </div>

    <Sortable v-model="accessLevels" class="flex flex-col" @end="onOrderUpdate">
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

    <AccessLevelFormDialog v-model:open="form.open" :access-level="form.accessLevel" />
    <ConfirmDestroyDialog
      v-model:open="destroy.open"
      title="Delete Access Level?"
      :action-href="`/access-levels/${destroy.accessLevel?.id}`"
    >
      Are you sure you'd like to delete your
      <strong>{{ destroy.accessLevel?.name }}</strong> access level? Any series using
      {{ destroy.accessLevel?.name }} will have their access level cleared.
    </ConfirmDestroyDialog>
  </div>
</template>
