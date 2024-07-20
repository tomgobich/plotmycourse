import vine from '@vinejs/vine'
import { existsInOrganization, OrganizationMetData } from './helpers/organization.js'
import { CourseMetaData, existsInCourse } from './helpers/course.js'

export const moduleValidator = vine.withMetaData<OrganizationMetData>().compile(
  vine.object({
    name: vine.string().maxLength(100),
    statusId: vine.number().exists(existsInOrganization('statuses')),
  })
)

export const modulePatchTagValidator = vine.withMetaData<OrganizationMetData>().compile(
  vine.object({
    statusId: vine.number().exists(existsInOrganization('statuses')),
  })
)

export const moduleOrderValidator = vine.withMetaData<CourseMetaData>().compile(
  vine.object({
    ids: vine.array(vine.number()),
  })
)
