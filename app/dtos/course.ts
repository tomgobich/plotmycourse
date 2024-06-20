import Course from '#models/course'
import OrganizationDto from '#dtos/organization'
import AccessLevelDto from '#dtos/access_level'
import DifficultyDto from '#dtos/difficulty'
import StatusDto from '#dtos/status'
import ModuleDto from '#dtos/module'
import LessonDto from '#dtos/lesson'

export default class CourseDto {
  declare id: number
  declare organizationId: number
  declare accessLevelId: number
  declare difficultyId: number
  declare statusId: number
  declare name: string
  declare notes: string | null
  declare order: number
  declare archivedAt: string | null
  declare createdAt: string
  declare updatedAt: string
  declare organization: OrganizationDto | null
  declare accessLevel: AccessLevelDto | null
  declare difficulty: DifficultyDto | null
  declare status: StatusDto | null
  declare modules: ModuleDto[]
  declare lessons: LessonDto[]

  constructor(course?: Course) {
    if (!course) return
    this.id = course.id
    this.organizationId = course.organizationId
    this.accessLevelId = course.accessLevelId
    this.difficultyId = course.difficultyId
    this.statusId = course.statusId
    this.name = course.name
    this.notes = course.notes
    this.order = course.order
    this.archivedAt = course.archivedAt?.toISO()!
    this.createdAt = course.createdAt.toISO()!
    this.updatedAt = course.updatedAt.toISO()!
    this.organization = course.organization && new OrganizationDto(course.organization)
    this.accessLevel = course.accessLevel && new AccessLevelDto(course.accessLevel)
    this.difficulty = course.difficulty && new DifficultyDto(course.difficulty)
    this.status = course.status && new StatusDto(course.status)
    this.modules = ModuleDto.fromArray(course.modules)
    this.lessons = LessonDto.fromArray(course.lessons)
  }

  static fromArray(courses: Course[]) {
    if (!courses) return []
    return courses.map((course) => new CourseDto(course))
  }
}
