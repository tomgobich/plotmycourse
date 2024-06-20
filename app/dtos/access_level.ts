import AccessLevel from '#models/access_level'
import OrganizationDto from '#dtos/organization'
import CourseDto from '#dtos/course'
import LessonDto from '#dtos/lesson'

export default class AccessLevelDto {
  declare id: number
  declare organizationId: number
  declare name: string
  declare color: string
  declare order: number
  declare isDefault: boolean
  declare createdAt: string
  declare updatedAt: string
  declare organization: OrganizationDto | null
  declare courses: CourseDto[]
  declare lessons: LessonDto[]
  declare hex: string

  constructor(accessLevel?: AccessLevel) {
    if (!accessLevel) return
    this.id = accessLevel.id
    this.organizationId = accessLevel.organizationId
    this.name = accessLevel.name
    this.color = accessLevel.color
    this.order = accessLevel.order
    this.isDefault = accessLevel.isDefault
    this.createdAt = accessLevel.createdAt.toISO()!
    this.updatedAt = accessLevel.updatedAt.toISO()!
    this.organization = accessLevel.organization && new OrganizationDto(accessLevel.organization)
    this.courses = CourseDto.fromArray(accessLevel.courses)
    this.lessons = LessonDto.fromArray(accessLevel.lessons)
    this.hex = accessLevel.hex
  }

  static fromArray(accessLevels: AccessLevel[]) {
    if (!accessLevels) return []
    return accessLevels.map((accessLevel) => new AccessLevelDto(accessLevel))
  }
}