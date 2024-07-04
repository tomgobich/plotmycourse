<script setup lang="ts">
import ModuleDto from '#dtos/module'
import Organization from '#models/organization'
import { computed } from 'vue'
import { Plus } from 'lucide-vue-next'

const props = defineProps<{
  organization: Organization
  modelValue: ModuleDto[]
}>()

const emit = defineEmits(['update:modelValue'])

const modules = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <Sortable v-model="modules" group="modules">
    <template #item="{ element: module, index }">
      <li class="flex flex-col border-b border-slate-200 pb-2 mb-2">
        <div
          class="flex items-center justify-between rounded-md px-2 py-2 hover:bg-slate-50 duration-300 group draggable relative"
        >
          <div class="flex items-center gap-4">
            <SortHandle />
            <span class="font-bold">{{ module.name }}</span>
            <span class="text-slate-400 text-sm slashed-zero"
              >{{ module.lessons.length }} Lessons</span
            >
          </div>

          <TagSelector
            v-model="module.statusId"
            :options="organization.statuses"
            :patch="{ path: `/modules/${module.id}/tags`, key: 'statusId' }"
          />
        </div>

        <SortableLessons v-model="modules[index]" :organization="organization" />
      </li>
    </template>
  </Sortable>

  <Button variant="ghost" size="sm" class="flex gap-2">
    <Plus class="w-4 h-4" />
    Add Module
  </Button>
</template>
