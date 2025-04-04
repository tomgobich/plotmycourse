import Organization from '#models/organization'
import CourseDto from '#dtos/course'
import ModuleDto from '#dtos/module'
import LessonDto from '#dtos/lesson'
import AccessLevelDto from '#dtos/access_level'
import DifficultyDto from '#dtos/difficulty'
import StatusDto from '#dtos/status'
import UserDto from '#dtos/user'
import { BaseModelDto } from '@adocasts.com/dto/base'
import LessonTypeDto from './lesson_type.js'

export default class OrganizationDto extends BaseModelDto {
  declare id: number
  declare name: string
  declare createdAt: string
  declare updatedAt: string
  declare courses: CourseDto[]
  declare modules: ModuleDto[]
  declare lessons: LessonDto[]
  declare accessLevels: AccessLevelDto[]
  declare difficulties: DifficultyDto[]
  declare statuses: StatusDto[]
  declare lessonTypes: LessonTypeDto[]
  declare users: UserDto[]

  constructor(organization?: Organization) {
    super()

    if (!organization) return
    this.id = organization.id
    this.name = organization.name
    this.createdAt = organization.createdAt.toISO()!
    this.updatedAt = organization.updatedAt.toISO()!
    this.courses = CourseDto.fromArray(organization.courses)
    this.modules = ModuleDto.fromArray(organization.modules)
    this.lessons = LessonDto.fromArray(organization.lessons)
    this.accessLevels = AccessLevelDto.fromArray(organization.accessLevels)
    this.difficulties = DifficultyDto.fromArray(organization.difficulties)
    this.statuses = StatusDto.fromArray(organization.statuses)
    this.lessonTypes = LessonTypeDto.fromArray(organization.lessonTypes)
    this.users = UserDto.fromArray(organization.users)
  }
}
