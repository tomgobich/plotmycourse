import { ref, UnwrapRef } from 'vue'

export function useSortableResource<T>(resources: T[]) {
  const model = ref(resources)

  const form = ref<{ open: Boolean; resource?: T }>({
    open: false,
    resource: undefined,
  })

  const destroying = ref<{ open: Boolean; resource?: T }>({
    open: false,
    resource: undefined,
  })

  function openCreate() {
    form.value.resource = undefined
    form.value.open = true
  }

  // UnwrapRef: https://github.com/vuejs/pinia/discussions/1512
  function openEdit(resource: UnwrapRef<T>) {
    form.value.resource = resource
    form.value.open = true
  }

  function openDestroy(resource: UnwrapRef<T>) {
    destroying.value.resource = resource
    destroying.value.open = true
  }

  return {
    model,
    form,
    destroying,
    open: {
      create: openCreate,
      edit: openEdit,
      destroy: openDestroy,
    },
  }
}
