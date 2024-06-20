import Role from '#models/role'

export default class RoleDto {
  declare id: number
  declare name: string
  declare createdAt: string

  constructor(role?: Role) {
    if (!role) return
    this.id = role.id
    this.name = role.name
    this.createdAt = role.createdAt.toISO()!
  }

  static fromArray(roles: Role[]) {
    if (!roles) return []
    return roles.map((role) => new RoleDto(role))
  }
}