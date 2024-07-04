<script setup lang="ts">
import OrganizationDto from '#dtos/organization'
import { computed } from 'vue'
import CourseDto from '#dtos/course'

const props = defineProps<{
  organization: OrganizationDto
  modelValue: CourseDto
}>()

const emit = defineEmits(['update:modelValue'])

const course = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const path = computed(() => `/courses/${course.value.id}`)
</script>

<template>
  <ul class="grid gap-3 mb-6">
    <li class="flex items-center gap-3">
      <div class="w-24">Status</div>
      <TagSelector
        v-model="course.statusId"
        :options="organization.statuses"
        :put="{ path, key: 'statusId' }"
      />
    </li>
    <li class="flex items-center gap-3">
      <div class="w-24">Difficulty</div>
      <TagSelector
        v-model="course.difficultyId"
        :options="organization.difficulties"
        :put="{ path, key: 'difficultyId' }"
      />
    </li>
    <li class="flex items-center gap-3">
      <div class="w-24">Access</div>
      <TagSelector
        v-model="course.accessLevelId"
        :options="organization.accessLevels"
        :put="{ path, key: 'accessLevelId' }"
      />
    </li>
  </ul>
</template>
