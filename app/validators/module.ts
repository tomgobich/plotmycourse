import vine from '@vinejs/vine'
import { existsInOrganization, OrganizationMetData } from './helpers/organization.js'

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

export const moduleOrderValidator = vine.compile(
  vine.object({
    ids: vine.array(vine.number()),
  })
)
