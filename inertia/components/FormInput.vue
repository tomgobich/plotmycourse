<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    type: string
    modelValue: string | number
    placeholder?: string
    label: string
    errors?: string[]
    disabled?: boolean
    autofocus?: boolean
  }>(),
  {
    type: 'string',
  }
)

const emits = defineEmits(['update:modelValue'])

const inputEl = ref()

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
})

defineExpose({ inputEl })
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
          ref="inputEl"
          v-model="internalValue"
          class="pl-10"
          :disabled="disabled"
          :placeholder="placeholder"
        />
      </div>
      <Select
        v-else-if="type === 'select'"
        v-model="internalValue"
        ref="inputEl"
        :disabled="disabled"
      >
        <SelectTrigger>
          <slot name="trigger">
            <SelectValue :placeholder="placeholder" />
          </slot>
        </SelectTrigger>
        <SelectContent>
          <slot />
        </SelectContent>
      </Select>
      <Input
        v-else
        v-model="internalValue"
        ref="inputEl"
        :type="type"
        :disabled="disabled"
        :placeholder="placeholder"
      />
    </Label>
    <div v-show="errors" class="text-red-500 text-sm">
      {{ errors?.join(',') }}
    </div>
  </div>
</template>
