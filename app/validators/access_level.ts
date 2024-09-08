import vine from '@vinejs/vine'
import { existsInOrganization, OrganizationMetaData } from '#validators/helpers/organization'

export const accessLevelValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(50),
    color: vine.string().maxLength(20).hexCode(),
  })
)

export const accessLevelOrderValidate = vine.compile(
  vine.object({
    ids: vine.array(vine.number()),
  })
)

export const accessLevelDestroyValidator = vine.withMetaData<OrganizationMetaData>().compile(
  vine.object({
    replacementId: vine.number().exists(existsInOrganization('access_levels')),
  })
)
