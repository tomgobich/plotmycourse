<script setup lang="ts">
import { EllipsisVertical, Plus } from 'lucide-vue-next'
import { watch, ref } from 'vue'
import { Link } from '@inertiajs/vue3'
import CourseDto from '#dtos/course'

const props = defineProps<{
  courses: CourseDto[]
}>()

const courses = ref(props.courses)

const destroy = ref<{ open: boolean; course?: CourseDto }>({
  open: false,
  course: undefined,
})

watch(
  () => props.courses,
  (value) => (courses.value = value)
)
</script>

<template>
  <div class="w-full max-w-screen-xl mx-auto bg-background border rounded-xl p-4">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold px-4">Courses</h1>

      <Button size="sm" variant="ghost">
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
      <TableBody>
        <TableRow v-for="course in courses" :key="course.id">
          <TableCell>
            <Link :href="`/courses/${course.id}`" class="hover:underline">
              {{ course.name }}
            </Link>
          </TableCell>
          <TableCell> {{ course.status!.name }} </TableCell>
          <TableCell> {{ course.difficulty!.name }} </TableCell>
          <TableCell> {{ course.accessLevel?.name }} </TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem :as="Link" :href="`/courses/${course.id}`">
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
