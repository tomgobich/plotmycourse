import User from '#models/user'
import { BaseModelDto } from '@adocasts.com/dto/base'

export default class UserDto extends BaseModelDto {
  declare id: number
  declare fullName: string | null
  declare email: string
  declare createdAt: string
  declare updatedAt: string | null

  constructor(user?: User) {
    super()

    if (!user) return
    this.id = user.id
    this.fullName = user.fullName
    this.email = user.email
    this.createdAt = user.createdAt.toISO()!
    this.updatedAt = user.updatedAt?.toISO()!
  }
}
