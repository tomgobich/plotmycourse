<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type: string
    modelValue: string | number
    placeholder?: string
    label: string
    errors?: string[]
    disabled?: boolean
  }>(),
  {
    type: 'string',
  }
)

const emits = defineEmits(['update:modelValue'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
})
</script>

<template>
  <div class="grid gap-1">
    <Label class="grid gap-1">
      <span>{{ label }} </span>
      <div v-if="type === 'color'" class="relative w-full items-center">
        <input
          v-model="internalValue"
          :type="type"
          :class="{ 'absolute start-2 inset-y-2 w-6 h-6 rounded': type === 'color' }"
          :disabled="disabled"
        />
        <Input
          v-if="type === 'color'"
          v-model="internalValue"
          class="pl-10"
          :disabled="disabled"
          :placeholder="placeholder"
        />
      </div>
      <Select v-else-if="type === 'select'" v-model="internalValue">
        <SelectTrigger>
          <slot name="trigger">
            <SelectValue :placeholder="placeholder" />
          </slot>
        </SelectTrigger>
        <SelectContent>
          <slot />
        </SelectContent>
      </Select>
      <Input v-else v-model="internalValue" :type="type" :placeholder="placeholder" />
    </Label>
    <div v-show="errors" class="text-red-500 text-sm">
      {{ errors?.join(',') }}
    </div>
  </div>
</template>
