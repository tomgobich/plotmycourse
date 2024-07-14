import vine from '@vinejs/vine'
import { existsInOrganization, OrganizationMetData } from './helpers/organization.js'
import { existsInCourse } from './helpers/course.js'

export const lessonValidator = vine.withMetaData<OrganizationMetData>().compile(
  vine.object({
    name: vine.string().maxLength(150),
    accessLevelId: vine.number().exists(existsInOrganization('access_levels')),
    statusId: vine.number().exists(existsInOrganization('statuses')),
  })
)

export const lessonPatchTagValidator = vine.withMetaData<OrganizationMetData>().compile(
  vine.object({
    statusId: vine
      .number()
      .exists(existsInOrganization('statuses'))
      .optional()
      .requiredIfMissing(['accessLevelId']),
    accessLevelId: vine
      .number()
      .exists(existsInOrganization('access_levels'))
      .optional()
      .requiredIfMissing(['statusId']),
  })
)

export const lessonOrderValidator = vine
  .withMetaData<{ organizationId: number; courseId: number }>()
  .compile(
    vine.object({
      modules: vine.array(
        vine.object({
          id: vine.number().exists(existsInCourse('modules')),
          lessons: vine.array(vine.number().exists(existsInOrganization('lessons'))),
        })
      ),
    })
  )
