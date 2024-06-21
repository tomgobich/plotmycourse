<template>
  <Sortable v-model="internalValue" :group="group" @end="$emit('end')">
    <div v-for="(item, index) in internalValue" :key="item[itemKey]">
      <slot name="item" :element="item" :index="index" />
    </div>
  </Sortable>
</template>

<script setup>
import { VueDraggableNext as Sortable } from "vue-draggable-next";
import { computed, ref } from "vue";

const props = defineProps({
  modelValue: Array,
  group: [Object, String],
  tag: {
    type: String,
    default: 'ul'
  },
  itemKey: {
    type: String,
    default: 'id'
  }
})

const emit = defineEmits(['update:modelValue', 'end'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const sortableOptions = ref({
  handle: ".handle",
  draggable: ".draggable",
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost"
})
</script>
