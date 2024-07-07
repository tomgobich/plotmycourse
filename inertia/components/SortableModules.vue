<script setup lang="ts">
import ModuleDto from '#dtos/module'
import Organization from '#models/organization'
import { computed } from 'vue'
import { Plus, Pencil, EllipsisVertical } from 'lucide-vue-next'
import { useResourceActions } from '~/composables/resource_actions'
import CourseDto from '#dtos/course'
import { Link, router } from '@inertiajs/vue3'

const props = defineProps<{
  organization: Organization
  course: CourseDto
  modelValue: ModuleDto[]
}>()

const emit = defineEmits(['update:modelValue'])

const modules = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const urlPrefix = computed(() => `/courses/${props.course.id}`)

const { form, dialog, destroy, onSuccess } = useResourceActions<ModuleDto>()({
  name: '',
  statusId: props.organization.statuses.at(0)?.id,
})

function onEdit(resource: ModuleDto) {
  dialog.value.open(resource, {
    name: resource.name,
    statusId: resource.statusId,
  })
}

function onModuleOrderChange() {
  const ids = modules.value.map((module) => module.id)
  router.patch(`${urlPrefix.value}/modules/order`, { ids })
}

function onSubmit() {
  const id = dialog.value.resource?.id

  if (id) {
    return form.put(`${urlPrefix.value}/modules/${id}`, { onSuccess })
  }

  form.post(`${urlPrefix.value}/modules`, { onSuccess })
}
</script>

<template>
  <Sortable v-model="modules" group="modules" @end="onModuleOrderChange">
    <template #item="{ element: module, index }">
      <li class="flex flex-col border-b border-slate-200 pb-2 mb-2">
        <div
          class="flex items-center justify-between rounded-md px-2 py-2 hover:bg-slate-50 duration-300 group draggable relative"
        >
          <div class="flex items-center gap-4">
            <SortHandle />
            <span class="font-bold">{{ module.name }}</span>
            <span class="text-slate-400 text-sm slashed-zero"
              >{{ module.lessons.length }} Lessons</span
            >

            <div class="opacity-0 group-hover:opacity-100 duration-300 ml-2 relative">
              <Button
                variant="ghost"
                size="icon"
                class="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8"
                @click="onEdit(module)"
              >
                <Pencil class="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div class="flex gap-2 items-center justify-end">
            <TagSelector
              v-model="module.statusId"
              :options="organization.statuses"
              :patch="{ path: `${urlPrefix}/modules/${module.id}/tags`, key: 'statusId' }"
            />

            <DropdownMenu>
              <DropdownMenuTrigger class="ml-2 text-slate-400 hover:text-slate-950 duration-300">
                <EllipsisVertical class="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem @click="onEdit(module)">Edit</DropdownMenuItem>
                <DropdownMenuItem @click="destroy.open(module)">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <SortableLessons v-model="modules[index]" :organization="organization" :course="course" />
      </li>
    </template>
  </Sortable>

  <Button variant="ghost" size="sm" class="flex gap-2" @click="dialog.open()">
    <Plus class="w-4 h-4" />
    Add Module
  </Button>

  <FormDialog
    resource="Series Module"
    v-model:open="dialog.isOpen"
    :editing="dialog.resource?.id"
    :processing="form.processing"
    @submit="onSubmit"
  >
    <FormInput
      label="Name"
      v-model="form.name"
      :errors="form.errors.name"
      placeholder="My Cool Module"
    />

    <FormInput type="select" label="Status" v-model="form.statusId" :errors="form.errors.statusId">
      <SelectItem v-for="status in props.organization.statuses" :key="status.id" :value="status.id">
        {{ status.name }}
      </SelectItem>
    </FormInput>
  </FormDialog>

  <ConfirmDestroyDialog
    v-model:open="destroy.isOpen"
    title="Delete Module?"
    :action-href="`${urlPrefix}/modules/${destroy.resource?.id}`"
  >
    Are you sure you'd like to delete your
    <strong>{{ destroy.resource?.name }}</strong> module? All this module's data, including lessons,
    will be deleted. be gone forever.
  </ConfirmDestroyDialog>
</template>
