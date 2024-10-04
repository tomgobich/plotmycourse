<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import OrganizationDto from '#dtos/organization'
import TextSearchTypes from '#enums/text_search_types'
import { useForm } from '@inertiajs/vue3'
import { createDebounce } from '~/lib/utils'
import { computed } from 'vue'
import AccessLevelDto from '#dtos/access_level'
import StatusDto from '#dtos/status'
import LessonTypeDto from '#dtos/lesson_type'

type TagTypeFields = 'accessLevelId' | 'statusId' | 'lessonTypeId'
type TagTypeDtos = AccessLevelDto | StatusDto | LessonTypeDto

const props = defineProps<{
  organization: OrganizationDto
}>()

const debounce = createDebounce()

const filters = useForm({
  name: {
    searchType: TextSearchTypes.INCLUDES,
    text: '',
  },
  statusId: new Set(props.organization.statuses.map((r) => r.id)),
  accessLevelId: new Set(props.organization.accessLevels.map((r) => r.id)),
  lessonTypeId: new Set(props.organization.lessonTypes.map((r) => r.id)),
})

const activeLessonTypeNames = computed(() =>
  getActiveNames(props.organization.lessonTypes, 'lessonTypeId')
)
const activeAccessLevelNames = computed(() =>
  getActiveNames(props.organization.accessLevels, 'accessLevelId')
)
const activeStatusNames = computed(() => getActiveNames(props.organization.statuses, 'statusId'))

function getActiveNames(items: TagTypeDtos[], field: TagTypeFields) {
  const active = items.filter((r) => filters[field].has(r.id)).map((r) => r.name)
  const [one, two, ...rest] = active
  const list = [one, two, ...(rest.length > 1 ? [`${rest.length} Others`] : rest)].filter(Boolean)
  return list.join(', ') || 'All'
}

function onUpdateCheckbox(
  field: 'accessLevelId' | 'statusId' | 'lessonTypeId',
  item: AccessLevelDto | StatusDto | LessonTypeDto,
  value: boolean
) {
  value ? filters[field].add(item.id) : filters[field].delete(item.id)
  runDebouncedFilter()
}

function runDebouncedFilter() {
  debounce(() => {
    filters
      .transform((data) => ({
        ...data,
        statusId: [...data.statusId],
        accessLevelId: [...data.accessLevelId],
        lessonTypeId: [...data.lessonTypeId],
      }))
      .get('/lessons', { preserveScroll: true, preserveState: true })
  }, 500)
}
</script>

<template>
  <div class="flex flex-wrap gap-3 bg-muted/40 border rounded-lg lg:p-4 mb-3">
    <FormInput
      type="search"
      label="Search"
      placeholder="Search by title"
      v-model="filters.name.text"
      :errors="filters.errors.name"
      @input="runDebouncedFilter"
    />

    <FormInput
      label="Lesson Type"
      type="group"
      v-model="filters.lessonTypeId"
      :errors="filters.errors.lessonTypeId"
    >
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="justify-between min-w-[125px]">
            {{ activeLessonTypeNames }} <ChevronDown class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="item in organization.lessonTypes"
            :key="item.id"
            class="capitalize"
            :checked="filters.lessonTypeId.has(item.id)"
            @update:checked="onUpdateCheckbox('lessonTypeId', item, $event)"
          >
            {{ item.name }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </FormInput>

    <FormInput
      label="Statuses"
      type="group"
      v-model="filters.statusId"
      :errors="filters.errors.statusId"
    >
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="justify-between min-w-[125px]">
            {{ activeStatusNames }} <ChevronDown class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="item in organization.statuses"
            :key="item.id"
            class="capitalize"
            :checked="filters.statusId.has(item.id)"
            @update:checked="onUpdateCheckbox('statusId', item, $event)"
          >
            {{ item.name }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </FormInput>

    <FormInput
      label="Access Levels"
      type="group"
      v-model="filters.accessLevelId"
      :errors="filters.errors.accessLevelId"
    >
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="justify-between min-w-[125px]">
            {{ activeAccessLevelNames }} <ChevronDown class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="item in organization.accessLevels"
            :key="item.id"
            class="capitalize"
            :checked="filters.accessLevelId.has(item.id)"
            @update:checked="onUpdateCheckbox('accessLevelId', item, $event)"
          >
            {{ item.name }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </FormInput>
  </div>
</template>
