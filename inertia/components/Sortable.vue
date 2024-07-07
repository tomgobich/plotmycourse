<template>
  <Sortable v-model="internalValue" :group="group" :tag="tag" :animation="200" @end="$emit('end')">
    <template v-for="(item, index) in internalValue" :key="item[itemKey]">
      <slot name="item" :element="item" :index="index" />
    </template>
  </Sortable>
</template>

<script setup>
import { VueDraggableNext as Sortable } from 'vue-draggable-next'
import { computed } from 'vue'

const props = defineProps({
  modelValue: Array,
  group: [Object, String],
  tag: {
    type: String,
    default: 'ul',
  },
  itemKey: {
    type: String,
    default: 'id',
  },
})

const emits = defineEmits(['update:modelValue', 'end'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
})
</script>
