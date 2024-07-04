<script setup lang="ts">
import ModuleDto from '#dtos/module'
import OrganizationDto from '#dtos/organization'
import { computed } from 'vue'
import { Plus, Pencil } from 'lucide-vue-next'

const props = defineProps<{
  organization: OrganizationDto
  modelValue: ModuleDto
}>()

const emit = defineEmits(['update:modelValue'])

const module = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <Sortable v-model="module.lessons" group="lessons" class="flex flex-col">
    <template #item="{ element: lesson }">
      <li
        class="flex items-center justify-between rounded-md px-2 py-2 hover:bg-slate-50 duration-300 group draggable relative"
      >
        <div class="flex items-center gap-4">
          <SortHandle />
          <span class="text-slate-400 slashed-zero w-[3ch]"
            >{{ module.order }}.{{ lesson.order }}</span
          >
          <span>{{ lesson.name }}</span>
          <div class="opacity-0 group-hover:opacity-100 duration-300 ml-2 relative">
            <Button
              variant="ghost"
              size="icon"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8"
            >
              <Pencil class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div class="flex justify-end items-center gap-2">
          <TagSelector
            v-model="lesson.accessLevelId"
            :options="organization.accessLevels"
            :patch="{ path: `/lessons/${lesson.id}/tags`, key: 'accessLevelId' }"
          />

          <TagSelector
            v-model="lesson.statusId"
            :options="organization.statuses"
            :patch="{ path: `/lessons/${lesson.id}/tags`, key: 'statusId' }"
          />
        </div>
      </li>
    </template>
  </Sortable>

  <ul>
    <li class="px-2 ml-[3ch]">
      <Button variant="ghost" size="sm" class="flex gap-2">
        <Plus class="w-4 h-4" />
        Add Lesson
      </Button>
    </li>
  </ul>
</template>
