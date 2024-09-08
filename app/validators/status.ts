import vine from '@vinejs/vine'
import { existsInOrganization, OrganizationMetaData } from './helpers/organization.js'

export const statusValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(50),
    color: vine.string().maxLength(20).hexCode(),
  })
)

export const statusOrderValidator = vine.compile(
  vine.object({
    ids: vine.array(vine.number()),
  })
)

export const statusDestroyValidator = vine.withMetaData<OrganizationMetaData>().compile(
  vine.object({
    replacementId: vine.number().exists(existsInOrganization('statuses')),
  })
)
