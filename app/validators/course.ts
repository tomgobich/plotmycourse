import vine from '@vinejs/vine'
import { existsInOrganization, OrganizationMetaData } from './helpers/organization.js'
import StringFilter from '#actions/filters/string_filter'
import NumbersFilter from '#actions/filters/numbers_filter'

export const courseValidator = vine.withMetaData<OrganizationMetaData>().compile(
  vine.object({
    name: vine.string().maxLength(150),
    statusId: vine.number().exists(existsInOrganization('statuses')),
    difficultyId: vine.number().exists(existsInOrganization('difficulties')),
    accessLevelId: vine.number().exists(existsInOrganization('access_levels')),
    notes: vine.string().optional(),
  })
)

export const coursePatchTagValidator = vine.withMetaData<OrganizationMetaData>().compile(
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

export const courseFilterValidator = vine.compile(
  vine.object({
    name: StringFilter.rule,
    statusId: NumbersFilter.rule,
    difficultyId: NumbersFilter.rule,
    accessLevelId: NumbersFilter.rule,
  })
)
