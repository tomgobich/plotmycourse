<script setup lang="ts">
import UserDto from '#dtos/user'
import RoleDto from '#dtos/role'
import { useForm } from '@inertiajs/vue3'
import Roles from '#enums/roles'

const props = defineProps<{ user: UserDto; users: UserDto[]; roles: RoleDto[] }>()

const inviteForm = useForm({
  email: '',
  roleId: Roles.OrganizationMember.toString(),
})

function getRoleName(roleId: number) {
  return props.roles.find((role) => role.id === roleId)?.name
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Organization Members</CardTitle>
      <CardDescription> Members of your organization. </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead> Name </TableHead>
            <TableHead> Email </TableHead>
            <TableHead> Role </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="member in users" :key="member.id">
            <TableCell>
              {{ member.fullName }}
              <span v-if="user.id === member.id" class="text-slate-400 italic inline-block ml-3">
                (You)
              </span>
            </TableCell>
            <TableCell>
              {{ member.email }}
            </TableCell>
            <TableCell>
              {{ getRoleName(member.meta.pivot_role_id) }}
            </TableCell>
            <TableCell>
              <div v-if="user.id !== member.id">
                <Button variant="ghost" size="sm" class="hover:text-red-500"> Remove </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div class="p-4 -m-4 rounded bg-slate-100 mt-8">
        <h4 class="font-bold">Invite New Member</h4>
        <div class="text-slate-400 text-sm mb-3">Invite a new member to your organization.</div>
        <form
          class="flex flex-wrap items-end gap-4"
          @submit.prevent="
            inviteForm.post('/settings/organization/invite', {
              onSuccess: () => inviteForm.reset(),
            })
          "
        >
          <FormInput
            label="Email"
            type="email"
            class="flex-1"
            v-model="inviteForm.email"
            :errors="inviteForm.errors.email"
            :disabled="inviteForm.processing"
          />

          <FormInput
            label="Role"
            type="select"
            v-model="inviteForm.roleId"
            :errors="inviteForm.errors.roleId"
            :disabled="inviteForm.processing"
          >
            <SelectItem v-for="role in roles" :key="role.id" :value="role.id.toString()">
              {{ role.name }}
            </SelectItem>
          </FormInput>

          <Button type="submit" :disabled="inviteForm.processing">
            <Loader v-if="inviteForm.processing" class="mr-2 h-4 w-4 animate-spin" />
            Send Invite
          </Button>
        </form>
      </div>
    </CardContent>
  </Card>
</template>
