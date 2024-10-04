import vine from '@vinejs/vine'
import { existsInOrganization, OrganizationMetaData } from './helpers/organization.js'

export const lessonTypeValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(50),
    color: vine.string().maxLength(20).hexCode(),
  })
)

export const lessonTypeOrderValidator = vine.compile(
  vine.object({
    ids: vine.array(vine.number()),
  })
)

export const lessonTypeDestroyValidator = vine.withMetaData<OrganizationMetaData>().compile(
  vine.object({
    replacementId: vine.number().exists(existsInOrganization('difficulties')),
  })
)
