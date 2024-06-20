import Module from '#models/module'
import OrganizationDto from '#dtos/organization'
import CourseDto from '#dtos/course'
import StatusDto from '#dtos/status'
import LessonDto from '#dtos/lesson'

export default class ModuleDto {
  declare id: number
  declare organizationId: number
  declare courseId: number
  declare statusId: number
  declare name: string
  declare notes: string | null
  declare order: number
  declare archivedAt: string | null
  declare createdAt: string
  declare updatedAt: string
  declare organization: OrganizationDto | null
  declare course: CourseDto | null
  declare status: StatusDto | null
  declare lessons: LessonDto[]

  constructor(module?: Module) {
    if (!module) return
    this.id = module.id
    this.organizationId = module.organizationId
    this.courseId = module.courseId
    this.statusId = module.statusId
    this.name = module.name
    this.notes = module.notes
    this.order = module.order
    this.archivedAt = module.archivedAt?.toISO()!
    this.createdAt = module.createdAt.toISO()!
    this.updatedAt = module.updatedAt.toISO()!
    this.organization = module.organization && new OrganizationDto(module.organization)
    this.course = module.course && new CourseDto(module.course)
    this.status = module.status && new StatusDto(module.status)
    this.lessons = LessonDto.fromArray(module.lessons)
  }

  static fromArray(modules: Module[]) {
    if (!modules) return []
    return modules.map((module) => new ModuleDto(module))
  }
}
