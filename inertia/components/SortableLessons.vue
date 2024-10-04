<script setup lang="ts">
import Sortable from 'vuedraggable'
import ModuleDto from '#dtos/module'
import OrganizationDto from '#dtos/organization'
import { computed, ref } from 'vue'
import { Plus, Pencil, EllipsisVertical, CalendarClock } from 'lucide-vue-next'
import CourseDto from '#dtos/course'
import { Link } from '@inertiajs/vue3'
import { DateTime } from 'luxon'
import type { LessonForm } from '~/types/lesson_form'

const props = defineProps<{
  organization: OrganizationDto
  course: CourseDto
  modelValue: ModuleDto
}>()

const emit = defineEmits(['update:modelValue', 'end'])

const actions = ref()
const module = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const defaultForm: LessonForm = {
  name: '',
  moduleId: module.value.id,
  publishAt: '',
  accessLevelId: props.organization.accessLevels.at(0)?.id.toString(),
  statusId: props.organization.statuses.at(0)?.id.toString(),
  lessonTypeId: props.organization.lessonTypes.at(0)?.id.toString(),
}
</script>

<template>
  <Sortable
    v-model="module.lessons"
    class="flex flex-col"
    group="lessons"
    handle=".handle"
    item-key="id"
    tag="ul"
    @end="$emit('end')"
  >
    <template #item="{ element: lesson }">
      <li
        class="flex flex-wrap items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50 duration-300 group draggable relative"
      >
        <div class="flex-1 max-w-full flex items-center gap-4">
          <SortHandle />

          <span class="text-slate-400 slashed-zero w-[3ch] text-sm handle cursor-move">
            {{ module.order }}.{{ lesson.order }}
          </span>

          <Link
            :href="`/lessons/${lesson.id}`"
            class="hover:underline text-sm inline-block truncate"
          >
            {{ lesson.name }}
          </Link>

          <span
            v-if="lesson.publishAt"
            class="text-slate-400 text-xs hidden lg:flex items-center gap-2"
          >
            <CalendarClock class="w-3 h-3" />
            {{ DateTime.fromISO(lesson.publishAt).toRelative() }}
          </span>

          <div class="opacity-0 group-hover:opacity-100 duration-300 ml-2 relative">
            <Button
              variant="ghost"
              size="icon"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7"
              @click="actions.edit(lesson)"
            >
              <Pencil class="w-3.5 h-3.5" />
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

          <DropdownMenu>
            <DropdownMenuTrigger class="ml-2 text-slate-400 hover:text-slate-950 duration-300">
              <EllipsisVertical class="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem :as="Link" :href="`/lessons/${lesson.id}`"> Open </DropdownMenuItem>
              <DropdownMenuItem @click="actions.edit(lesson)">Edit</DropdownMenuItem>
              <DropdownMenuItem @click="actions.destroy(lesson)">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </li>
    </template>
  </Sortable>

  <ul>
    <li class="px-2 ml-[3ch]">
      <Button variant="ghost" size="sm" class="flex gap-2" @click="actions.create()">
        <Plus class="w-4 h-4" />
        Add Lesson
      </Button>
    </li>
  </ul>

  <LessonActions ref="actions" :default-form="defaultForm" :organization="organization" />
</template>
