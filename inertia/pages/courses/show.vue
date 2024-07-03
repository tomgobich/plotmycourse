<script setup lang="ts">
import OrganizationDto from '#dtos/organization'
import CourseDto from '#dtos/course'
import ModuleDto from '#dtos/module'
import TagSelector from "~/components/TagSelector.vue"
import Sortable from "~/components/Sortable.vue"
import { ref } from "vue";
import SortHandle from "~/components/SortHandle.vue"
import { Button } from '~/components/ui/button'
import { Plus } from 'lucide-vue-next'

const props = defineProps<{
  organization: OrganizationDto
  course: CourseDto
  modules: ModuleDto[]
}>()

const modules = ref(props.modules)
</script>

<template>
  <div class="w-full max-w-screen-xl mx-auto bg-background border rounded-xl p-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold px-4">{{ course.name }}</h1>
    </div>

    <div class="px-4">
      <ul class="grid gap-3 mb-6">
        <li class="flex items-center gap-3">
          <div class="w-24">Status</div>
          <TagSelector v-model="course.statusId" :options="organization.statuses" />
        </li>
        <li class="flex items-center gap-3">
          <div class="w-24">Difficulty</div>
          <TagSelector v-model="course.difficultyId" :options="organization.difficulties" />
        </li>
        <li class="flex items-center gap-3">
          <div class="w-24">Access</div>
          <TagSelector v-model="course.accessLevelId" :options="organization.accessLevels" />
        </li>
      </ul>
    </div>

    <div class="px-2">
      <div class="border-b border-slate-200 text-slate-400 text-sm py-2 mb-2 px-2">
        {{ modules.length }} Modules, {{ course.meta.lessons_count }} Lessons
      </div>

      <Sortable v-model="modules">
        <template #item="{ element: module }">
          <li class="flex flex-col border-b border-slate-200 pb-2 mb-2">
            <div class="flex items-center justify-between rounded-md px-2 py-2 hover:bg-slate-50 duration-300 group draggable relative">
              <div class="flex items-center gap-4">
                <SortHandle />
                <span class="font-bold">{{ module.name }}</span>
                <span class="text-slate-400 text-sm slashed-zero">{{ module.lessons.length }} Lessons</span>
              </div>

              <TagSelector v-model="module.statusId" :options="organization.statuses" />
            </div>
            <Sortable v-model="module.lessons" class="flex flex-col">
              <template #item="{ element: lesson }">
                <li class="flex items-center justify-between rounded-md px-2 py-2 hover:bg-slate-50 duration-300 group draggable relative">
                  <div class="flex items-center gap-4">
                    <SortHandle />
                    <span class="text-slate-400 slashed-zero w-[3ch]">{{ module.order }}.{{ lesson.order }}</span>
                    <span>{{ lesson.name }}</span>
<!--                    <div class="opacity-0 group-hover:opacity-100 duration-300 ml-2">-->
<!--                      <Button icon="pi pi-pencil" size="small" class="!p-2 -my-2 !w-auto !h-auto" @click="editLesson(lesson)" text rounded />-->
<!--                    </div>-->
                  </div>

                  <TagSelector v-model="lesson.statusId" :options="organization.statuses" />
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
          </li>
        </template>
      </Sortable>

      <Button variant="ghost" size="sm" class="flex gap-2">
        <Plus class="w-4 h-4" />
        Add Module
      </Button>
    </div>
  </div>
</template>
