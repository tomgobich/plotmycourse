<script setup lang="ts">
import Sortable from 'vuedraggable'
import ModuleDto from '#dtos/module'
import OrganizationDto from '#dtos/organization'
import { computed, nextTick, ref } from 'vue'
import { Plus, Pencil, EllipsisVertical, CalendarClock } from 'lucide-vue-next'
import { useResourceActions } from '~/composables/resource_actions'
import LessonDto from '#dtos/lesson'
import CourseDto from '#dtos/course'
import { Link } from '@inertiajs/vue3'
import SelectItem from './ui/select/SelectItem.vue'
import { DateTime } from 'luxon'

type LessonForm = {
  name: string
  publishAt: string | null
  accessLevelId?: string
  statusId?: string
}

const props = defineProps<{
  organization: OrganizationDto
  course: CourseDto
  modelValue: ModuleDto
}>()

const emit = defineEmits(['update:modelValue', 'end'])

const dialogFocusEl = ref()
const userZone = DateTime.now().zoneName

const module = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const urlPrefix = computed(() => `/courses/${props.course.id}/modules/${module.value.id}`)

const { form, dialog, destroy, onSuccess } = useResourceActions<LessonDto>()<LessonForm>({
  name: '',
  publishAt: '',
  accessLevelId: props.organization.accessLevels.at(0)?.id.toString(),
  statusId: props.organization.statuses.at(0)?.id.toString(),
})

function onCreate() {
  dialog.value.open()
  nextTick(() => dialogFocusEl.value.inputEl.$el.focus())
}

function onEdit(resource: LessonDto) {
  dialog.value.open(resource, {
    name: resource.name,
    publishAt: resource.publishAt,
    accessLevelId: resource.accessLevelId.toString(),
    statusId: resource.statusId.toString(),
  })
  nextTick(() => dialogFocusEl.value.inputEl.$el.focus())
}

function onSubmit() {
  const id = dialog.value.resource?.id

  if (id) {
    return form.put(`${urlPrefix.value}/lessons/${id}`, { onSuccess, preserveScroll: true })
  }

  form.post(`${urlPrefix.value}/lessons`, { onSuccess, preserveScroll: true })
}
</script>

<template>
  <Sortable
    v-model="module.lessons"
    class="flex flex-col"
    group="lessons"
    item-key="id"
    tag="ul"
    @end="$emit('end')"
  >
    <template #item="{ element: lesson }">
      <li
        class="flex flex-wrap items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50 duration-300 group draggable relative"
      >
        <div class="flex-1 max-w-full flex items-center gap-4">
          <SortHandle />

          <span class="text-slate-400 slashed-zero w-[3ch] text-sm handle cursor-move">
            {{ module.order }}.{{ lesson.order }}
          </span>

          <Link
            :href="`${urlPrefix}/lessons/${lesson.id}`"
            class="hover:underline text-sm inline-block truncate"
          >
            {{ lesson.name }}
          </Link>

          <span
            v-if="lesson.publishAt"
            class="text-slate-400 text-xs hidden lg:flex items-center gap-2"
          >
            <CalendarClock class="w-3 h-3" />
            {{ DateTime.fromISO(lesson.publishAt).toRelative() }}
          </span>

          <div class="opacity-0 group-hover:opacity-100 duration-300 ml-2 relative">
            <Button
              variant="ghost"
              size="icon"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7"
              @click="onEdit(lesson)"
            >
              <Pencil class="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div class="flex justify-end items-center gap-2">
          <TagSelector
            v-model="lesson.accessLevelId"
            :options="organization.accessLevels"
            :patch="{ path: `${urlPrefix}/lessons/${lesson.id}/tags`, key: 'accessLevelId' }"
          />

          <TagSelector
            v-model="lesson.statusId"
            :options="organization.statuses"
            :patch="{ path: `${urlPrefix}/lessons/${lesson.id}/tags`, key: 'statusId' }"
          />

          <DropdownMenu>
            <DropdownMenuTrigger class="ml-2 text-slate-400 hover:text-slate-950 duration-300">
              <EllipsisVertical class="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem :as="Link" :href="`${urlPrefix}/lessons/${lesson.id}`">
                Open
              </DropdownMenuItem>
              <DropdownMenuItem @click="onEdit(lesson)">Edit</DropdownMenuItem>
              <DropdownMenuItem @click="destroy.open(lesson)">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </li>
    </template>
  </Sortable>

  <ul>
    <li class="px-2 ml-[3ch]">
      <Button variant="ghost" size="sm" class="flex gap-2" @click="onCreate">
        <Plus class="w-4 h-4" />
        Add Lesson
      </Button>
    </li>
  </ul>

  <FormDialog
    resource="Lesson"
    v-model:open="dialog.isOpen"
    :editing="dialog.resource?.id"
    :processing="form.processing"
    @submit="onSubmit"
  >
    <FormInput
      ref="dialogFocusEl"
      label="Name"
      v-model="form.name"
      :errors="form.errors.name"
      placeholder="My Cool Lesson"
    />

    <FormInput type="group" label="Publish At" :errors="form.errors.publishAt">
      <DatePicker v-model="form.publishAt" />
    </FormInput>

    <FormInput
      type="select"
      label="Access Level"
      v-model="form.accessLevelId"
      :errors="form.errors.accessLevelId"
    >
      <SelectItem
        v-for="level in props.organization.accessLevels"
        :key="level.id"
        :value="level.id.toString()"
      >
        {{ level.name }}
      </SelectItem>
    </FormInput>

    <FormInput type="select" label="Status" v-model="form.statusId" :errors="form.errors.statusId">
      <SelectItem
        v-for="status in props.organization.statuses"
        :key="status.id"
        :value="status.id.toString()"
      >
        {{ status.name }}
      </SelectItem>
    </FormInput>
  </FormDialog>

  <ConfirmDestroyDialog
    v-model:open="destroy.isOpen"
    title="Delete Lesson?"
    :action-href="`${urlPrefix}/lessons/${destroy.resource?.id}`"
  >
    Are you sure you'd like to delete your
    <strong>{{ destroy.resource?.name }}</strong> lesson? All data associated with this lesson will
    be gone forever.
  </ConfirmDestroyDialog>
</template>
