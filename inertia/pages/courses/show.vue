<script setup lang="ts">
import OrganizationDto from '#dtos/organization'
import CourseDto from '#dtos/course'
import ModuleDto from '#dtos/module'
import { Pencil, Trash2 } from 'lucide-vue-next'
import { ref, watchEffect, toRaw, onMounted } from 'vue'

const props = defineProps<{
  organization: OrganizationDto
  course: CourseDto
  modules: ModuleDto[]
  qs: Record<string, any>
}>()

const internalCourse = ref({ ...props.course })
const internalModules = ref(structuredClone(toRaw(props.modules)))
const actions = ref()

watchEffect(() => (internalCourse.value = { ...props.course }))
watchEffect(() => (internalModules.value = structuredClone(toRaw(props.modules))))

onMounted(() => {
  if (props.qs.module) {
    setTimeout(() => {
      const moduleLi = document.querySelector(`li[data-module-id="${props.qs.module}"]`)
      moduleLi?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }
})
</script>

<template>
  <AppHead :title="course.name" :description="`Manage your course ${course.name}`" />

  <div class="w-full max-w-screen-lg mx-auto bg-background border rounded-xl p-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold px-4">{{ course.name }}</h1>

      <div class="flex items-center justify-end gap-2">
        <Button size="sm" variant="ghost" @click="actions.edit(internalCourse)">
          <Pencil class="w-3 h-3 mr-2" />
          Edit
        </Button>

        <Button
          size="sm"
          variant="ghost"
          class="hover:text-red-500"
          @click="actions.destroy(internalCourse)"
        >
          <Trash2 class="w-3 h-3 mr-2" />
          Delete
        </Button>
      </div>
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

    <CourseActions ref="actions" :organization="organization" />
  </div>
</template>
