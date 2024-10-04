<script setup lang="ts">
import { EllipsisVertical, Plus } from 'lucide-vue-next'
import { ref, watchEffect } from 'vue'
import { Link } from '@inertiajs/vue3'
import OrganizationDto from '#dtos/organization'
import LessonDto from '#dtos/lesson'
import type { SimplePaginatorDtoContract } from '@adocasts.com/dto/types'
import { LessonForm } from '~/types/lesson_form'
import { Pagination, PaginationList, PaginationListItem } from '~/components/ui/pagination'

const props = defineProps<{
  organization: OrganizationDto
  lessons: SimplePaginatorDtoContract<LessonDto>
}>()

const actions = ref()
const lessons = ref(props.lessons)
const defaultForm: LessonForm = {
  name: '',
  publishAt: '',
  accessLevelId: props.organization.accessLevels.at(0)?.id.toString(),
  statusId: props.organization.statuses.at(0)?.id.toString(),
  lessonTypeId: props.organization.lessonTypes.at(0)?.id.toString(),
}

watchEffect(() => (lessons.value = props.lessons))
</script>

<template>
  <AppHead title="Lessons" :description="`View all planned lessons for ${organization.name}`" />

  <div class="w-full max-w-screen-xl mx-auto bg-background border rounded-xl py-4 lg:px-4">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold px-4">Lessons</h1>

      <Button size="sm" variant="ghost" @click="actions.create()">
        <Plus class="w-3 h-3 mr-2" />
        Add Lesson
      </Button>
    </div>

    <LessonFilters :organization="organization" />

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead> Title </TableHead>
          <TableHead> Course </TableHead>
          <TableHead> Lesson Type </TableHead>
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
            <div v-if="lesson.module" class="text-xs leading-tight flex flex-col">
              <Link
                v-if="lesson.module.course"
                :href="`/courses/${lesson.module.course?.id}`"
                class="text-slate-600"
              >
                {{ lesson.module.course?.name }}
              </Link>
              {{ lesson.module.name }}
            </div>
          </TableCell>
          <TableCell> {{ lesson.lessonType!.name }} </TableCell>
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
                <DropdownMenuItem @click="actions.edit(lesson)">Edit</DropdownMenuItem>
                <DropdownMenuItem @click="actions.destroy(lesson)">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>

        <TableRow v-if="!lessons.data?.length">
          <TableCell class="text-center" colspan="5"> You don't have any courses yet. </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="flex justify-end pt-3">
      <Pagination
        v-model:page="lessons.meta.currentPage"
        v-slot="{ page }"
        :total="lessons.meta.total"
        :sibling-count="1"
        :items-per-page="lessons.meta.perPage"
        show-edges
      >
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst :href="lessons.meta.firstPageUrl" />
          <PaginationPrev :href="lessons.meta.previousPageUrl" />

          <template v-for="(item, index) in items">
            <PaginationListItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              as-child
            >
              <Button
                class="w-8 h-8 p-0"
                :variant="item.value === page ? 'default' : 'outline'"
                as-child
              >
                <Link
                  :href="
                    lessons.meta.pagesInRange?.find((range) => range.page === item.value)?.url ??
                    '/lessons'
                  "
                >
                  {{ item.value }}
                </Link>
              </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>

          <PaginationNext :href="lessons.meta.nextPageUrl" />
          <PaginationLast :href="lessons.meta.lastPageUrl" />
        </PaginationList>
      </Pagination>
    </div>

    <LessonActions ref="actions" :default-form="defaultForm" :organization="organization" />
  </div>
</template>
