<script setup lang="ts">
import { EllipsisVertical, GripVertical, Plus } from 'lucide-vue-next'
import { ref, watchEffect } from 'vue'
import { Link, router } from '@inertiajs/vue3'
import CourseDto from '#dtos/course'
import OrganizationDto from '#dtos/organization'
import Sortable from 'vuedraggable'

const props = defineProps<{
  organization: OrganizationDto
  courses: CourseDto[]
}>()

const courses = ref(props.courses)
const actions = ref()

watchEffect(() => (courses.value = props.courses))

function onOrderUpdate() {
  const ids = courses.value.map((course) => course.id)
  router.put('/courses/order', { ids }, { preserveScroll: true })
}
</script>

<template>
  <AppHead title="Courses" :description="`Manage the courses of ${organization.name}`" />

  <div class="w-full max-w-screen-xl mx-auto bg-background border rounded-xl py-4 lg:px-4">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold px-4">Courses</h1>

      <Button size="sm" variant="ghost" @click="actions.create()">
        <Plus class="w-3 h-3 mr-2" />
        Add Course
      </Button>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead> Name </TableHead>
          <TableHead> Status </TableHead>
          <TableHead> Difficulty </TableHead>
          <TableHead> Access </TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <Sortable
        v-if="courses?.length"
        v-model="courses"
        item-key="id"
        handle=".handle"
        tag="tbody"
        class="[&_tr:last-child]:border-0"
        @end="onOrderUpdate"
      >
        <template #item="{ element: course }">
          <TableRow class="group">
            <TableCell>
              <div class="flex items-center gap-3">
                <div
                  class="text-slate-300 group-hover:text-slate-950 duration-300 handle cursor-move"
                >
                  <GripVertical class="w-4 h-4" />
                </div>
                <Link :href="`/courses/${course.id}`" class="hover:underline">
                  {{ course.name }}
                </Link>
              </div>
            </TableCell>
            <TableCell> {{ course.status!.name }} </TableCell>
            <TableCell> {{ course.difficulty!.name }} </TableCell>
            <TableCell> {{ course.accessLevel?.name }} </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical class="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem :as="Link" :href="`/courses/${course.id}`">
                    Open
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="actions.edit(course)">Edit</DropdownMenuItem>
                  <DropdownMenuItem @click="actions.destroy(course)">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </template>
      </Sortable>
      <TableBody v-else>
        <TableRow>
          <TableCell class="text-center" colspan="5"> You don't have any courses yet. </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <CourseActions ref="actions" :organization="organization" />
  </div>
</template>
