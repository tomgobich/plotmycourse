<script setup lang="ts">
import { EllipsisVertical, Plus } from 'lucide-vue-next'
import { ref, watchEffect } from 'vue'
import { Link } from '@inertiajs/vue3'
import OrganizationDto from '#dtos/organization'
import LessonDto from '#dtos/lesson'
import type { SimplePaginatorDtoContract } from '@adocasts.com/dto/types'

const props = defineProps<{
  organization: OrganizationDto
  lessons: SimplePaginatorDtoContract<LessonDto>
}>()

const lessons = ref(props.lessons)
// const actions = ref()

watchEffect(() => (lessons.value = props.lessons))
</script>

<template>
  <AppHead title="Lessons" :description="`View all planned lessons for ${organization.name}`" />

  <div class="w-full max-w-screen-xl mx-auto bg-background border rounded-xl py-4 lg:px-4">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold px-4">Lessons</h1>

      <!-- <Button size="sm" variant="ghost" @click="actions.create()">
        <Plus class="w-3 h-3 mr-2" />
        Add Lesson
      </Button> -->
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead> Title </TableHead>
          <TableHead> Course </TableHead>
          <TableHead> Status </TableHead>
          <TableHead> Access </TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="lesson in lessons.data" :key="lesson.id">
          <TableCell>
            <Link :href="`/lessons/${lesson.id}`" class="hover:underline">
              {{ lesson.name }}
            </Link>
          </TableCell>
          <TableCell>
            <div v-if="lesson.module" class="text-xs leading-tight">
              <div v-if="lesson.module.course" class="text-slate-600">
                {{ lesson.module.course?.name }}
              </div>
              {{ lesson.module.name }}
            </div>
          </TableCell>
          <TableCell> {{ lesson.status!.name }} </TableCell>
          <TableCell> {{ lesson.accessLevel?.name }} </TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical class="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem :as="Link" :href="`/lessons/${lesson.id}`">
                  Open
                </DropdownMenuItem>
                <!-- <DropdownMenuItem @click="actions.edit(lesson)">Edit</DropdownMenuItem>
                <DropdownMenuItem @click="actions.destroy(lesson)">Delete</DropdownMenuItem> -->
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>

        <TableRow v-if="!lessons.data?.length">
          <TableCell class="text-center" colspan="5"> You don't have any courses yet. </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- <CourseActions ref="actions" :organization="organization" /> -->
  </div>
</template>
