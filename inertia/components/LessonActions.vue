<script setup lang="ts">
import OrganizationDto from '#dtos/organization'
import { nextTick, ref } from 'vue'
import { useResourceActions } from '~/composables/resource_actions'
import LessonFormDto from '#dtos/lesson_form'
import LessonDto from '#dtos/lesson'
import { DateTime } from 'luxon'

const props = defineProps<{
  defaultForm: LessonFormDto
  organization: OrganizationDto
}>()

const dialogFocusEl = ref()
const { form, dialog, destroy, onSuccess } = useResourceActions<LessonDto>()<LessonFormDto>(
  props.defaultForm
)

function onCreate() {
  dialog.value.open()
  nextTick(() => dialogFocusEl.value.inputEl.$el.focus())
}

function onEdit(resource: LessonDto) {
  dialog.value.open(resource, new LessonFormDto(resource))
  nextTick(() => dialogFocusEl.value.inputEl.$el.focus())
}

function onSubmit() {
  const id = dialog.value.resource?.id
  const action = form.transform(({ publishAtDate, publishAtTime, ...data }) => ({
    ...data,
    publishAt:
      publishAtDate && publishAtTime
        ? DateTime.fromISO(`${publishAtDate}T${publishAtTime}`).toUTC()
        : null,
  }))

  if (id) {
    return action.put(`/lessons/${id}`, { onSuccess, preserveScroll: true })
  }

  action.post(`/lessons`, { onSuccess, preserveScroll: true })
}

defineExpose({
  create: onCreate,
  edit: onEdit,
  destroy: (resource: LessonDto) => destroy.value.open(resource),
})
</script>

<template>
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

    <FormInput
      type="group"
      label="Publish At"
      :errors="form.errors.publishAtDate || form.errors.publishAtTime"
    >
      <DatePicker v-model:date="form.publishAtDate" v-model:time="form.publishAtTime" />
    </FormInput>

    <FormInput
      type="select"
      label="Lesson Type"
      v-model="form.lessonTypeId"
      :errors="form.errors.lessonTypeId"
    >
      <SelectItem
        v-for="type in organization.lessonTypes"
        :key="type.id"
        :value="type.id.toString()"
      >
        {{ type.name }}
      </SelectItem>
    </FormInput>

    <FormInput
      type="select"
      label="Access Level"
      v-model="form.accessLevelId"
      :errors="form.errors.accessLevelId"
    >
      <SelectItem
        v-for="level in organization.accessLevels"
        :key="level.id"
        :value="level.id.toString()"
      >
        {{ level.name }}
      </SelectItem>
    </FormInput>

    <FormInput type="select" label="Status" v-model="form.statusId" :errors="form.errors.statusId">
      <SelectItem
        v-for="status in organization.statuses"
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
    :action-href="`/lessons/${destroy.resource?.id}`"
  >
    Are you sure you'd like to delete your
    <strong>{{ destroy.resource?.name }}</strong> lesson? All data associated with this lesson will
    be gone forever.
  </ConfirmDestroyDialog>
</template>
