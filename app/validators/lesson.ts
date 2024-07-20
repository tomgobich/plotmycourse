import vine from '@vinejs/vine'
import { existsInOrganization, OrganizationMetData } from './helpers/organization.js'
import { existsInCourse } from './helpers/course.js'
import { DateTime } from 'luxon'

export const lessonValidator = vine.withMetaData<OrganizationMetData>().compile(
  vine.object({
    name: vine.string().maxLength(150),
    publishAt: vine
      .date({ formats: { utc: true } })
      .nullable()
      .optional()
      .transform((value) => (value ? DateTime.fromJSDate(value) : null)),
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
          id: vine.number(),
          lessons: vine.array(vine.number()),
        })
      ),
    })
  )
