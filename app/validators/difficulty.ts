import vine from '@vinejs/vine'
import { existsInOrganization, OrganizationMetData } from './helpers/organization.js'

export const difficultyValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(50),
    color: vine.string().maxLength(20),
  })
)

export const difficultyOrderValidator = vine.withMetaData<OrganizationMetData>().compile(
  vine.object({
    ids: vine.array(vine.number().exists(existsInOrganization('difficulties'))),
  })
)
