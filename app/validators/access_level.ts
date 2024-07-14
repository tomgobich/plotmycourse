import vine from '@vinejs/vine'
import { existsInOrganization, OrganizationMetData } from './helpers/organization.js'

export const accessLevelValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(50),
    color: vine.string().maxLength(20),
  })
)

export const accessLevelOrderValidate = vine.withMetaData<OrganizationMetData>().compile(
  vine.object({
    ids: vine.array(vine.number().exists(existsInOrganization('access_levels'))),
  })
)
