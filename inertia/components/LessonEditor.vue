<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { watchEffect } from 'vue'
import { Loader } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
  processing: boolean
}>()

const emit = defineEmits(['update:modelValue', 'blur'])

const editor = useEditor({
  content: props.modelValue,
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose-base m-4 focus:outline-none',
    },
  },
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: "Let's rock this lesson ...",
    }),
  ],
  onUpdate: (event) => {
    emit('update:modelValue', event.editor.getHTML())
  },
  onBlur: (event) => {
    emit('blur', event.editor.getHTML())
  },
})

watchEffect(() => {
  if (props.modelValue !== editor.value?.getHTML()) {
    editor.value?.commands.setContent(props.modelValue, false)
  }
})
</script>

<template>
  <div v-if="editor" class="relative">
    <editor-content :editor="editor" />

    <div
      v-show="processing"
      class="flex gap-2 items-center absolute bottom-0 right-0 text-xs bg-white/50 backdrop-blur-md p-2 rounded shadow"
    >
      <Loader class="w-3 h-3 animate-spin" />
      Saving ...
    </div>
  </div>
</template>

<style scoped>
:deep(.tiptap) p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
