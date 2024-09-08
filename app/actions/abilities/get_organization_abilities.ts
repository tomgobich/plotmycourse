import Roles from '#enums/roles'

type Params = {
  roleId: number
}

export type OrganizationAbilities = {
  edit: boolean
  destroy: boolean
  manageUsers: boolean
  manageAccessTokens: boolean
}

export default class GetOrganizationAbilities {
  static handle({ roleId }: Params): OrganizationAbilities {
    return {
      edit: this.canEdit(roleId),
      destroy: this.canDestroy(roleId),
      manageUsers: this.canManageUsers(roleId),
      manageAccessTokens: this.canManageAccessTokens(roleId),
    }
  }

  static canEdit(roleId: number) {
    return roleId === Roles.OrganizationAdmin
  }

  static canDestroy(roleId: number) {
    return roleId === Roles.OrganizationAdmin
  }

  static canManageUsers(roleId: number) {
    return roleId === Roles.OrganizationAdmin
  }

  static canManageAccessTokens(roleId: number) {
    return roleId === Roles.OrganizationAdmin
  }
}
