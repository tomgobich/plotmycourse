import User from '#models/user'

export default class UserDto {
  declare id: number
  declare fullName: string | null
  declare email: string
  declare password: string
  declare createdAt: string
  declare updatedAt: string | null

  constructor(user?: User) {
    if (!user) return
    this.id = user.id
    this.fullName = user.fullName
    this.email = user.email
    this.password = user.password
    this.createdAt = user.createdAt.toISO()!
    this.updatedAt = user.updatedAt?.toISO()!
  }

  static fromArray(users: User[]) {
    if (!users) return []
    return users.map((user) => new UserDto(user))
  }
}