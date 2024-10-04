import OrganizationDto from '#dtos/organization'
import { BaseModelDto } from '@adocasts.com/dto/base'
import LessonType from '#models/lesson_type'

export default class LessonTypeDto extends BaseModelDto {
  declare id: number
  declare organizationId: number
  declare name: string
  declare color: string
  declare order: number
  declare isDefault: boolean
  declare createdAt: string
  declare updatedAt: string
  declare organization: OrganizationDto | null
  declare meta: Record<string, any>

  constructor(lesson_type?: LessonType) {
    super()

    if (!lesson_type) return
    this.id = lesson_type.id
    this.organizationId = lesson_type.organizationId
    this.name = lesson_type.name
    this.color = lesson_type.color
    this.order = lesson_type.order
    this.isDefault = lesson_type.isDefault
    this.createdAt = lesson_type.createdAt.toISO()!
    this.updatedAt = lesson_type.updatedAt.toISO()!
    this.organization = lesson_type.organization && new OrganizationDto(lesson_type.organization)
    this.meta = lesson_type.$extras
  }
}
