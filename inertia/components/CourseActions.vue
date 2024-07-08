<script setup lang="ts">
import CourseDto from '#dtos/course'
import OrganizationDto from '#dtos/organization'
import { useResourceActions } from '~/composables/resource_actions'

const props = defineProps<{
  organization: OrganizationDto
}>()

const { form, dialog, destroy, onSuccess } = useResourceActions<CourseDto>()({
  name: '',
  statusId: props.organization.statuses.at(0)?.id.toString(),
  difficultyId: props.organization.difficulties.at(0)?.id.toString(),
  accessLevelId: props.organization.accessLevels.at(0)?.id.toString(),
})

function onSubmit() {
  const id = dialog.value.resource?.id

  if (id) {
    return form.put(`/courses/${id}`, { onSuccess })
  }

  form.post(`/courses`, { onSuccess })
}

function onCreate() {
  dialog.value.open()
}

function onEdit(course: CourseDto) {
  dialog.value.open(course, {
    name: course.name,
    statusId: course.statusId.toString(),
    difficultyId: course.difficultyId.toString(),
    accessLevelId: course.accessLevelId.toString(),
  })
}

function onDestroy(course: CourseDto) {
  destroy.value.open(course)
}

defineExpose({
  create: onCreate,
  edit: onEdit,
  destroy: onDestroy,
})
</script>

<template>
  <FormDialog
    resource="Course"
    v-model:open="dialog.isOpen"
    :editing="dialog.resource?.id"
    :processing="form.processing"
    @submit="onSubmit"
  >
    <FormInput
      label="Name"
      v-model="form.name"
      :errors="form.errors.name"
      placeholder="My Cool Course"
    />

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

    <FormInput
      type="select"
      label="Difficulty"
      v-model="form.difficultyId"
      :errors="form.errors.difficultyId"
    >
      <SelectItem
        v-for="difficulty in props.organization.difficulties"
        :key="difficulty.id"
        :value="difficulty.id.toString()"
      >
        {{ difficulty.name }}
      </SelectItem>
    </FormInput>
  </FormDialog>

  <ConfirmDestroyDialog
    v-model:open="destroy.isOpen"
    title="Delete Course?"
    :action-href="`/courses/${destroy.resource?.id}`"
  >
    Are you sure you'd like to delete your
    <strong>{{ destroy.resource?.name }}</strong> course? All data associated with this course,
    including modules and lessons, will be deleted forever.
  </ConfirmDestroyDialog>
</template>
