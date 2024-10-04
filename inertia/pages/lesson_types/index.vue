<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { watchEffect, ref, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import { useResourceActions } from '~/composables/resource_actions'
import OrganizationDto from '../../../app/dtos/organization'
import LessonTypeDto from '#dtos/lesson_type'

const props = defineProps<{
  lessonTypes: LessonTypeDto[]
  organization: OrganizationDto
}>()

const list = ref(props.lessonTypes)
const { form, dialog, destroy, onSuccess } = useResourceActions<LessonTypeDto>()({
  name: '',
  color: '#818cf8',
})

const destroyReplacementOptions = computed(() =>
  props.lessonTypes.filter((lessonType) => lessonType.id !== destroy.value.resource?.id)
)

watchEffect(() => {
  list.value = props.lessonTypes
})

function onEdit(resource: LessonTypeDto) {
  dialog.value.open(resource, {
    name: resource.name,
    color: resource.color,
  })
}

function onSubmit() {
  const id = dialog.value.resource?.id

  if (id) {
    return form.put(`/lesson-types/${id}`, { onSuccess })
  }

  form.post('/lesson-types', { onSuccess })
}

function onDestroyShow(resource: LessonTypeDto) {
  destroy.value.open(resource, {
    replacementId: props.lessonTypes
      .find((lessonType) => lessonType.id !== resource.id)
      ?.id.toString(),
  })
}

function onOrderUpdate() {
  const ids = list.value.map((lessonType) => lessonType.id)
  router.put('/lesson-types/order', { ids }, { preserveScroll: true })
}
</script>

<template>
  <AppHead title="Lesson Types" :description="`Manage the lessonTypes of ${organization.name}`" />

  <div class="w-full max-w-2xl mx-auto bg-background border rounded-xl p-4">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold px-4">Lesson Types</h1>

      <Button @click="dialog.open()" size="sm" variant="ghost">
        <Plus class="w-3 h-3 mr-2" />
        Add Lesson Type
      </Button>
    </div>

    <SortableResourceItem
      v-model="list"
      @end="onOrderUpdate"
      @edit="onEdit"
      @destroy="onDestroyShow"
    />

    <FormDialog
      resource="Lesson Type"
      v-model:open="dialog.isOpen"
      :processing="form.processing"
      :editing="dialog.resource?.id"
      @submit="onSubmit"
    >
      <FormInput label="Name" v-model="form.name" :errors="form.errors.name" />
      <FormInput type="color" label="Color" v-model="form.color" :errors="form.errors.color" />
    </FormDialog>

    <ConfirmDestroyDialog
      v-model:open="destroy.isOpen"
      title="Delete Lesson Type?"
      :action-href="`/lesson-types/${destroy.resource?.id}`"
      :action-data="destroy.data"
    >
      <div v-if="destroy.resource?.meta.lessons_count">
        What lesson type would you like to assign the lessons using
        {{ destroy.resource?.name }}?

        <FormInput
          label="Lesson Type"
          type="select"
          v-model="destroy.data.replacementId"
          class="mt-4"
        >
          <SelectItem
            v-for="lessonType in destroyReplacementOptions"
            :key="lessonType.id"
            :value="lessonType.id.toString()"
          >
            {{ lessonType.name }}
          </SelectItem>
        </FormInput>
      </div>
      <div v-else>
        Are you sure you'd like to delete your
        <strong>{{ destroy.resource?.name }}</strong> lesson type? No lessons are currently using
        it.
      </div>
    </ConfirmDestroyDialog>
  </div>
</template>
