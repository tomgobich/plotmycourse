import Difficulty from '#models/difficulty'
import OrganizationDto from '#dtos/organization'
import { BaseModelDto } from '@adocasts.com/dto/base'

export default class DifficultyDto extends BaseModelDto {
  declare id: number
  declare organizationId: number
  declare name: string
  declare color: string
  declare order: number
  declare isDefault: boolean
  declare createdAt: string
  declare updatedAt: string
  declare organization: OrganizationDto | null

  constructor(difficulty?: Difficulty) {
    super()

    if (!difficulty) return
    this.id = difficulty.id
    this.organizationId = difficulty.organizationId
    this.name = difficulty.name
    this.color = difficulty.color
    this.order = difficulty.order
    this.isDefault = difficulty.isDefault
    this.createdAt = difficulty.createdAt.toISO()!
    this.updatedAt = difficulty.updatedAt.toISO()!
    this.organization = difficulty.organization && new OrganizationDto(difficulty.organization)
  }
}
