<script setup lang="ts">
import OrganizationDto from '#dtos/organization'
import { Pencil, Trash2 } from 'lucide-vue-next'
import { watchEffect, computed, ref } from 'vue'
import LessonDto from '#dtos/lesson'
import { useForm } from '@inertiajs/vue3'
import { DateTime } from 'luxon'
import LessonFormDto from '#dtos/lesson_form'

const props = defineProps<{
  organization: OrganizationDto
  lesson: LessonDto
}>()

const publishAt = computed(() => props.lesson.publishAt && DateTime.fromISO(props.lesson.publishAt))
const module = computed(() => props.lesson.module)
const course = computed(() => module.value?.course)
const breadcrumbs = computed(() => {
  if (course.value && module.value) {
    return [
      { name: course.value.name, href: `/courses/${course.value.id}` },
      { name: module.value.name, href: `/courses/${course.value.id}?module=${module.value.id}` },
      { name: `Lesson ${module.value.order}.${props.lesson.order}` },
    ]
  }

  return [{ name: 'Lessons', href: '/lessons' }, { name: props.lesson.name }]
})

const tagPath = computed(() => `/lessons/${props.lesson.id}/tags`)

const form = useForm({
  notes: props.lesson.notes,
})

const actions = ref()
const defaultLessonForm: LessonFormDto = {
  name: '',
  moduleId: module.value?.id,
  publishAtDate: null,
  publishAtTime: null,
  accessLevelId: props.organization.accessLevels.at(0)?.id.toString(),
  statusId: props.organization.statuses.at(0)?.id.toString(),
  lessonTypeId: props.organization.lessonTypes.at(0)?.id.toString(),
}

watchEffect(() => (form.notes = props.lesson.notes))
</script>

<template>
  <AppHead :title="lesson.name" :description="`Manage your lesson ${lesson.name}`" />

  <div class="w-full max-w-screen-lg mx-auto bg-background border rounded-xl py-4 lg:px-4">
    <div class="flex flex-wrap items-start justify-between mb-6">
      <div class="px-4">
        <Breadcrumbs :items="breadcrumbs" class="mb-4" />

        <h1 class="text-2xl font-bold">{{ lesson.name }}</h1>
      </div>

      <div class="flex items-center justify-end gap-2">
        <Button size="sm" variant="ghost" @click="actions.edit(lesson)">
          <Pencil class="w-3 h-3 mr-2" />
          Edit
        </Button>

        <Button
          size="sm"
          variant="ghost"
          class="hover:text-red-500"
          @click="actions.destroy(lesson)"
        >
          <Trash2 class="w-3 h-3 mr-2" />
          Delete
        </Button>
      </div>
    </div>

    <ul class="grid gap-3 mb-6 mx-4 pb-6 border-b border-slate-300">
      <li v-if="publishAt" class="flex items-center gap-3">
        <div class="w-24">Publish</div>
        <div class="flex items-baseline gap-2">
          <span>{{ publishAt.toRelative() }}</span>
          <span class="text-slate-600 text-xs italic">
            ({{ publishAt.toLocaleString(DateTime.DATETIME_FULL) }})
          </span>
        </div>
      </li>
      <li class="flex items-center gap-3">
        <div class="w-24">Type</div>
        <TagSelector
          v-model="lesson.lessonTypeId"
          :options="organization.lessonTypes"
          :patch="{ path: tagPath, key: 'lessonTypeId' }"
        />
      </li>
      <li class="flex items-center gap-3">
        <div class="w-24">Status</div>
        <TagSelector
          v-model="lesson.statusId"
          :options="organization.statuses"
          :patch="{ path: tagPath, key: 'statusId' }"
        />
      </li>
      <li class="flex items-center gap-3">
        <div class="w-24">Access</div>
        <TagSelector
          v-model="lesson.accessLevelId"
          :options="organization.accessLevels"
          :patch="{ path: tagPath, key: 'accessLevelId' }"
        />
      </li>
    </ul>

    <LessonEditor
      v-model="form.notes"
      :proccessing="form.processing"
      @blur="
        form.patch(`/lessons/${props.lesson.id}/notes`, {
          preserveState: true,
          preserveScroll: true,
        })
      "
    />

    <LessonActions ref="actions" :default-form="defaultLessonForm" :organization="organization" />
  </div>
</template>
