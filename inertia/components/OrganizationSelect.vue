<script setup lang="ts">
import OrganizationDto from '#dtos/organization'
import { router } from '@inertiajs/vue3'
import { ChevronsUpDown } from 'lucide-vue-next'
import { useResourceActions } from '../composables/resource_actions'
import { ref, watchEffect } from 'vue'
import type { Abilities } from '#actions/abilities/get_abilities'

const props = defineProps<{
  organization: OrganizationDto
  organizations: OrganizationDto[]
  can: Abilities
}>()

const organizationId = ref(props.organization.id.toString())
const { form, dialog, destroy, onSuccess } = useResourceActions<OrganizationDto>()({
  name: '',
})

watchEffect(() => (organizationId.value = props.organization.id.toString()))

function onOrganizationChange(activeId: string) {
  router.get(`/organizations/${activeId}`)
}

function onEdit(organization: OrganizationDto) {
  dialog.value.open(organization, {
    name: organization.name,
  })
}

function onSubmit() {
  const id = dialog.value.resource?.id

  if (id) {
    return form.put(`/organizations/${id}`, { onSuccess })
  }

  form.post(`/organizations`, { onSuccess })
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost">
        {{ organization.name }}
        <ChevronsUpDown class="w-4 h-4 ml-2" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel>Your Organizations ({{ organizations.length }})</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup v-model="organizationId" @update:modelValue="onOrganizationChange">
        <DropdownMenuRadioItem
          v-for="org in organizations"
          :key="org.id"
          :value="org.id.toString()"
        >
          {{ org.name }}
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem v-if="can.organization.edit" @click="onEdit(organization)">
        Edit {{ organization.name }}
      </DropdownMenuItem>
      <DropdownMenuItem v-if="can.organization.destroy" @click="destroy.open(organization)">
        Delete {{ organization.name }}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="dialog.open()">Add Organization</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <FormDialog
    resource="Organization"
    v-model:open="dialog.isOpen"
    :processing="form.processing"
    :editing="dialog.resource?.id"
    @submit="onSubmit"
  >
    <FormInput label="Name" v-model="form.name" :errors="form.errors.name" />
  </FormDialog>

  <ConfirmDestroyDialog
    v-model:open="destroy.isOpen"
    title="Delete Organization?"
    :action-href="`/organizations/${destroy.resource?.id}`"
  >
    Are you sure you'd like to delete your
    <strong>{{ destroy.resource?.name }}</strong> organization? All data associated with this
    organization, including courses and lessons, will be deleted forever.
  </ConfirmDestroyDialog>
</template>
