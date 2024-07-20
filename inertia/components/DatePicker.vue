<script setup lang="ts">
import { computed } from 'vue'
import { DateTime } from 'luxon'
import { Calendar as CalendarIcon } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const date = computed({
  get: () => {
    if (!props.modelValue) return null
    return DateTime.fromISO(props.modelValue).toJSDate()
  },
  set: (value) => {
    const date = value ? DateTime.fromJSDate(value).toISO() : null
    emit('update:modelValue', date)
  },
})
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="['w-full justify-start text-left font-normal', { 'text-muted-foreground': !date }]"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        <span>
          {{ date ? DateTime.fromJSDate(date) : 'Pick a date' }}
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="date" mode="datetime">
        <template #footer>
          <Button variant="ghost" size="sm" class="w-full" @click="date = null">Clear</Button>
        </template>
      </Calendar>
    </PopoverContent>
  </Popover>
</template>
