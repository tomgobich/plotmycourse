<script setup lang="ts">
import DifficultyDto from '#dtos/difficulty'
import { GripVertical, Pencil, Trash2, Plus } from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps<{
  difficulties: DifficultyDto[]
}>()

const confirmations = ref<Record<number, boolean>>({})
const difficulties = ref<DifficultyDto[]>(props.difficulties)

const form = ref<{ open: boolean; difficulty?: DifficultyDto }>({
  open: false,
  difficulty: undefined,
})

const destroy = ref<{ open: boolean; difficulty?: DifficultyDto }>({
  open: false,
  difficulty: undefined,
})

function onOrderUpdate() {
  const ids = difficulties.value.map((difficulty) => difficulty.id)
  console.log({ ids })
}

function onCreate() {
  form.value.difficulty = undefined
  form.value.open = true
}

function onEdit(difficulty: DifficultyDto) {
  form.value.difficulty = difficulty
  form.value.open = true
}

function onDestroy(difficulty: DifficultyDto) {
  destroy.value.difficulty = difficulty
  destroy.value.open = true
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto bg-background border rounded-xl p-4">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold px-4">Difficulties</h1>

      <Button @click="onCreate" size="sm" variant="ghost">
        <Plus class="w-3 h-3 mr-2" />
        Add Difficulty
      </Button>
    </div>

    <Sortable v-model="difficulties" class="flex flex-col" @end="onOrderUpdate">
      <template #item="{ element }">
        <li
          class="flex items-center justify-between rounded-md px-3 py-1.5 hover:bg-slate-100 duration-300 group draggable"
          :class="{ 'bg-slate-100': confirmations[element.id] }"
        >
          <div class="flex items-center gap-4">
            <div class="text-slate-300 group-hover:text-slate-950 duration-300 handle cursor-move">
              <GripVertical class="w-4 h-4" />
            </div>
            <div
              class="w-3 h-3 rounded-full bg-slate-100"
              :style="`background-color: ${element.hex}`"
            ></div>
            <span class="font-bold">{{ element.name }}</span>
            <span v-if="element.isDefault" class="text-sm text-slate-400">(Default)</span>
          </div>
          <div
            class="flex gap-2 opacity-0 group-hover:opacity-100 duration-300"
            :class="{ 'opacity-100': confirmations[element.id] }"
          >
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

    <DifficultyFormDialog v-model:open="form.open" :difficulty="form.difficulty" />
    <DifficultyConfirmDestroy v-model:open="destroy.open" :difficulty="destroy.difficulty" />
  </div>
</template>
