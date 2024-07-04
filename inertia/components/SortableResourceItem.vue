<script setup lang="ts">
import { GripVertical, Pencil, Trash2 } from 'lucide-vue-next'

defineProps<{
  element: {
    name: string
    color: string
    isDefault: boolean
  }
}>()

defineEmits(['edit', 'destroy'])
</script>

<template>
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
      <Button size="xs" @click="$emit('edit', element)">
        <Pencil class="w-3 h-3" />
      </Button>

      <Button variant="destructive" size="xs" @click="$emit('destroy', element)">
        <Trash2 class="w-3 h-3" />
      </Button>
    </div>
  </li>
</template>
