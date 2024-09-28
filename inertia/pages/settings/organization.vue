<script setup lang="ts">
import OrganizationDto from '#dtos/organization'
import UserDto from '#dtos/user'
import RoleDto from '#dtos/role'
import { Abilities } from '#actions/abilities/get_abilities'
import OrganizationInviteDto from '#dtos/organization_invite'
import AccessTokenDto from '#dtos/access_token'

defineProps<{
  organization: OrganizationDto
  inDev: boolean
  can: Abilities
  user: UserDto
  users: UserDto[]
  invites: OrganizationInviteDto[]
  roles: RoleDto[]
  accessTokens: AccessTokenDto[]
}>()
</script>

<template>
  <AppHead
    title="Organization Settings"
    :description="`Manage your ${organization.name} organization`"
  />

  <main
    class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8"
  >
    <div class="mx-auto grid w-full max-w-6xl gap-2">
      <h1 class="text-3xl font-semibold">Settings</h1>
    </div>
    <div
      class="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"
    >
      <AsideNavigation :can="can" />

      <div class="grid gap-6">
        <OrganizationEditCard :organization="organization" />
        <OrganizationUsersCard :user="user" :users="users" :roles="roles" />
        <OrganizationUserInvitesCard :invites="invites" :roles="roles" />
        <OrganizationAccessTokens v-if="inDev" :tokens="accessTokens" />
      </div>
    </div>
  </main>
</template>
