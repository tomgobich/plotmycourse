import { BaseModelDto } from '@adocasts.com/dto/base'
import AccessLevel from '#models/access_level'
import OrganizationDto from '#dtos/organization'
import CourseDto from '#dtos/course'
import LessonDto from '#dtos/lesson'
import { ApiProperty, ApiPropertyOptional } from '@foadonis/openapi/decorators'

export default class AccessLevelDto extends BaseModelDto {
  @ApiProperty()
  declare id: number
  
  @ApiProperty()
  declare organizationId: number
  
  @ApiProperty()
  declare name: string
  
  @ApiProperty()
  declare color: string
  
  @ApiProperty()
  declare order: number
  
  @ApiProperty()
  declare isDefault: boolean
  
  @ApiProperty()
  declare createdAt: string
  
  @ApiProperty()
  declare updatedAt: string
  
  declare organization: OrganizationDto | null
  
  declare courses: CourseDto[]
  
  declare lessons: LessonDto[]
  
  declare meta: Record<string, any>

  constructor(accessLevel?: AccessLevel) {
    super()

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
    this.meta = accessLevel.$extras
  }
}
