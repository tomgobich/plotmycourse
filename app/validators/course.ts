import vine from '@vinejs/vine'
import { existsInOrganization, OrganizationMetData } from './helpers/organization.js'

export const courseValidator = vine.withMetaData<OrganizationMetData>().compile(
  vine.object({
    name: vine.string().maxLength(150),
    statusId: vine.number().exists(existsInOrganization('statuses')),
    difficultyId: vine.number().exists(existsInOrganization('difficulty')),
    accessLevelId: vine.number().exists(existsInOrganization('access_levels')),
    notes: vine.string().optional(),
  })
)

export const coursePatchTagValidator = vine.withMetaData<OrganizationMetData>().compile(
  vine.object({
    statusId: vine
      .number()
      .exists(existsInOrganization('statuses'))
      .optional()
      .requiredIfMissing(['difficultyId', 'accessLevelId']),
    difficultyId: vine
      .number()
      .exists(existsInOrganization('difficulties'))
      .optional()
      .requiredIfMissing(['statusId', 'accessLevelId']),
    accessLevelId: vine
      .number()
      .exists(existsInOrganization('access_levels'))
      .optional()
      .requiredIfMissing(['statusId', 'difficultyId']),
  })
)
