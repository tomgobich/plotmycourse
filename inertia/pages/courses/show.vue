<script setup lang="ts">
import OrganizationDto from '#dtos/organization'
import CourseDto from '#dtos/course'
import ModuleDto from '#dtos/module'
import TagSelector from "~/components/TagSelector.vue";

defineProps<{
  organization: OrganizationDto
  course: CourseDto
  modules: ModuleDto
}>()
</script>

<template>
  <div class="w-full max-w-screen-xl mx-auto bg-background border rounded-xl p-4">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold px-4">{{ course.name }}</h1>
    </div>

    <div class="px-4">
      <ul class="grid gap-3">
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
  </div>
</template>
