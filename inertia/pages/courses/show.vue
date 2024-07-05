<script setup lang="ts">
import OrganizationDto from '#dtos/organization'
import CourseDto from '#dtos/course'
import ModuleDto from '#dtos/module'
import { ref, watchEffect } from 'vue'

const props = defineProps<{
  organization: OrganizationDto
  course: CourseDto
  modules: ModuleDto[]
}>()

const internalCourse = ref(props.course)
const internalModules = ref(props.modules)

watchEffect(() => (internalCourse.value = props.course))
watchEffect(() => (internalModules.value = props.modules))
</script>

<template>
  <div class="w-full max-w-screen-lg mx-auto bg-background border rounded-xl p-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold px-4">{{ course.name }}</h1>
    </div>

    <div class="px-4">
      <CourseDetails v-model="internalCourse" :organization="organization" />
    </div>

    <div class="px-2">
      <div class="border-b border-slate-200 text-slate-400 text-sm py-2 mb-2 px-2">
        {{ modules.length }} Modules, {{ course.meta.lessons_count }} Lessons
      </div>

      <SortableModules
        v-model="internalModules"
        :organization="organization"
        :course="internalCourse"
      />
    </div>
  </div>
</template>
