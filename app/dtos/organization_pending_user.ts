import { BaseModelDto } from '@adocasts.com/dto/base'
import OrganizationPendingUser from '#models/organization_pending_user'
import OrganizationDto from '#dtos/organization'
import UserDto from '#dtos/user'

export default class OrganizationPendingUserDto extends BaseModelDto {
  declare id: number
  declare organizationId: number
  declare invitedByUserId: number
  declare roleId: number
  declare email: string
  declare acceptedAt: string | null
  declare createdAt: string
  declare updatedAt: string
  declare organization: OrganizationDto | null
  declare invitedByUser: UserDto | null

  constructor(organizationPendingUser?: OrganizationPendingUser) {
    super()

    if (!organizationPendingUser) return
    this.id = organizationPendingUser.id
    this.organizationId = organizationPendingUser.organizationId
    this.invitedByUserId = organizationPendingUser.invitedByUserId
    this.roleId = organizationPendingUser.roleId
    this.email = organizationPendingUser.email
    this.acceptedAt = organizationPendingUser.acceptedAt?.toISO()
    this.createdAt = organizationPendingUser.createdAt.toISO()!
    this.updatedAt = organizationPendingUser.updatedAt.toISO()!
    this.organization =
      organizationPendingUser.organization &&
      new OrganizationDto(organizationPendingUser.organization)
    this.invitedByUser =
      organizationPendingUser.invitedByUser && new UserDto(organizationPendingUser.invitedByUser)
  }
}
