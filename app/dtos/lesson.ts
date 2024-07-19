import Lesson from '#models/lesson'
import OrganizationDto from '#dtos/organization'
import ModuleDto from '#dtos/module'
import StatusDto from '#dtos/status'

export default class LessonDto {
  declare id: number
  declare organizationId: number
  declare accessLevelId: number
  declare moduleId: number
  declare statusId: number
  declare name: string
  declare notes: string | null
  declare order: number
  declare publishAt: string | null
  declare createdAt: string
  declare updatedAt: string
  declare organization: OrganizationDto | null
  declare module: ModuleDto | null
  declare status: StatusDto | null

  constructor(lesson?: Lesson) {
    if (!lesson) return
    this.id = lesson.id
    this.organizationId = lesson.organizationId
    this.accessLevelId = lesson.accessLevelId
    this.moduleId = lesson.moduleId
    this.statusId = lesson.statusId
    this.name = lesson.name
    this.notes = lesson.notes
    this.order = lesson.order
    this.publishAt = lesson.publishAt?.toISO()!
    this.createdAt = lesson.createdAt.toISO()!
    this.updatedAt = lesson.updatedAt.toISO()!
    this.organization = lesson.organization && new OrganizationDto(lesson.organization)
    this.module = lesson.module && new ModuleDto(lesson.module)
    this.status = lesson.status && new StatusDto(lesson.status)
  }

  static fromArray(lessons: Lesson[]) {
    if (!lessons) return []
    return lessons.map((lesson) => new LessonDto(lesson))
  }
}
