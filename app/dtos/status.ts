import Status from '#models/status'
import OrganizationDto from '#dtos/organization'
import CourseDto from '#dtos/course'
import ModuleDto from '#dtos/module'
import LessonDto from '#dtos/lesson'
import { BaseModelDto } from '@adocasts.com/dto/base'

export default class StatusDto extends BaseModelDto {
  declare id: number
  declare organizationId: number
  declare name: string
  declare color: string
  declare order: number
  declare isDefault: boolean
  declare createdAt: string
  declare updatedAt: string
  declare organization: OrganizationDto | null
  declare course: CourseDto[]
  declare module: ModuleDto[]
  declare lessons: LessonDto[]
  declare meta: Record<string, any>

  constructor(status?: Status) {
    super()

    if (!status) return
    this.id = status.id
    this.organizationId = status.organizationId
    this.name = status.name
    this.color = status.color
    this.order = status.order
    this.isDefault = status.isDefault
    this.createdAt = status.createdAt.toISO()!
    this.updatedAt = status.updatedAt.toISO()!
    this.organization = status.organization && new OrganizationDto(status.organization)
    this.course = CourseDto.fromArray(status.course)
    this.module = ModuleDto.fromArray(status.module)
    this.lessons = LessonDto.fromArray(status.lessons)
    this.meta = status.$extras
  }
}
