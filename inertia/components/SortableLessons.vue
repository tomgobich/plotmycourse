<script setup lang="ts">
import ModuleDto from '#dtos/module'
import OrganizationDto from '#dtos/organization'
import { computed } from 'vue'
import { Plus, Pencil } from 'lucide-vue-next'
import { useResourceActions } from '~/composables/resource_actions'
import LessonDto from '#dtos/lesson'

const props = defineProps<{
  organization: OrganizationDto
  modelValue: ModuleDto
}>()

const emit = defineEmits(['update:modelValue'])

const module = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const { form, dialog, destroy, onSuccess } = useResourceActions<LessonDto>()({
  name: '',
  accessLevelId: props.organization.accessLevels.at(0)?.id,
  statusId: props.organization.statuses.at(0)?.id,
})

function onEdit(resource: LessonDto) {
  dialog.value.open(resource, {
    name: resource.name,
    accessLevelId: resource.accessLevelId,
    statusId: resource.statusId,
  })
}

function onSubmit() {
  const id = dialog.value.resource?.id

  if (id) {
    return form.put(`/modules/${module.value.id}/lessons/${id}`, { onSuccess })
  }

  form.post(`/modules/${module.value.id}/lessons`, { onSuccess })
}
</script>

<template>
  <Sortable v-model="module.lessons" group="lessons" class="flex flex-col">
    <template #item="{ element: lesson }">
      <li
        class="flex items-center justify-between rounded-md px-2 py-2 hover:bg-slate-50 duration-300 group draggable relative"
      >
        <div class="flex items-center gap-4">
          <SortHandle />
          <span class="text-slate-400 slashed-zero w-[3ch]"
            >{{ module.order }}.{{ lesson.order }}</span
          >
          <span>{{ lesson.name }}</span>
          <div class="opacity-0 group-hover:opacity-100 duration-300 ml-2 relative">
            <Button
              variant="ghost"
              size="icon"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8"
              @click="onEdit(lesson)"
            >
              <Pencil class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div class="flex justify-end items-center gap-2">
          <TagSelector
            v-model="lesson.accessLevelId"
            :options="organization.accessLevels"
            :patch="{ path: `/lessons/${lesson.id}/tags`, key: 'accessLevelId' }"
          />

          <TagSelector
            v-model="lesson.statusId"
            :options="organization.statuses"
            :patch="{ path: `/lessons/${lesson.id}/tags`, key: 'statusId' }"
          />
        </div>
      </li>
    </template>
  </Sortable>

  <ul>
    <li class="px-2 ml-[3ch]">
      <Button variant="ghost" size="sm" class="flex gap-2" @click="dialog.open()">
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
      label="Name"
      v-model="form.name"
      :errors="form.errors.name"
      placeholder="My Cool Lesson"
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
        :value="level.id"
      >
        {{ level.name }}
      </SelectItem>
    </FormInput>

    <FormInput type="select" label="Status" v-model="form.statusId" :errors="form.errors.statusId">
      <SelectItem v-for="status in props.organization.statuses" :key="status.id" :value="status.id">
        {{ status.name }}
      </SelectItem>
    </FormInput>
  </FormDialog>
</template>
