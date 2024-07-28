import { BaseModelDto } from '@adocasts.com/dto/base'
import OrganizationInvite from '#models/organization_invite'
import OrganizationDto from '#dtos/organization'
import UserDto from '#dtos/user'

export default class OrganizationInviteDto extends BaseModelDto {
  declare id: number
  declare organizationId: number
  declare invitedByUserId: number
  declare canceledByUserId: number | null
  declare roleId: number
  declare email: string
  declare acceptedAt: string | null
  declare canceledAt: string | null
  declare createdAt: string
  declare updatedAt: string
  declare organization: OrganizationDto | null
  declare invitedByUser: UserDto | null
  declare canceledByUser: UserDto | null

  constructor(organizationInvite?: OrganizationInvite) {
    super()

    if (!organizationInvite) return
    this.id = organizationInvite.id
    this.organizationId = organizationInvite.organizationId
    this.invitedByUserId = organizationInvite.invitedByUserId
    this.canceledByUserId = organizationInvite.cancledByUserId
    this.roleId = organizationInvite.roleId
    this.email = organizationInvite.email
    this.acceptedAt = organizationInvite.acceptedAt?.toISO()!
    this.canceledAt = organizationInvite.canceledAt?.toISO()!
    this.createdAt = organizationInvite.createdAt.toISO()!
    this.updatedAt = organizationInvite.updatedAt.toISO()!
    this.organization =
      organizationInvite.organization && new OrganizationDto(organizationInvite.organization)
    this.invitedByUser =
      organizationInvite.invitedByUser && new UserDto(organizationInvite.invitedByUser)
    this.canceledByUser =
      organizationInvite.canceledByUser && new UserDto(organizationInvite.canceledByUser)
  }
}
