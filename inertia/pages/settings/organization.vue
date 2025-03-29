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
    class="flex flex-col flex-1 gap-4 md:gap-8 bg-muted/40 p-4 min-h-[calc(100vh_-_theme(spacing.16))]"
  >
    <div class="gap-2 grid mx-auto w-full max-w-6xl">
      <h1 class="font-semibold text-3xl">Settings</h1>
    </div>
    <div
      class="items-start gap-6 grid md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr] mx-auto w-full max-w-6xl"
    >
      <AsideNavigation :can="can" />

      <div class="gap-6 grid">
        <OrganizationEditCard :organization="organization" />
        <OrganizationUsersCard :user="user" :users="users" :roles="roles" />
        <OrganizationUserInvitesCard :invites="invites" :roles="roles" />

        <!-- working, but not documented -->
        <OrganizationAccessTokens v-if="inDev || organization.id === 2" :tokens="accessTokens" />
      </div>
    </div>
  </main>
</template>
