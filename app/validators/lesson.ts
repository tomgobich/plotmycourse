import vine from '@vinejs/vine'
import { existsInOrganization, OrganizationMetaData } from './helpers/organization.js'
import { DateTime } from 'luxon'
import StringFilter from '#actions/filters/string_filter'
import NumbersFilter from '#actions/filters/numbers_filter'

export const lessonValidator = vine.withMetaData<OrganizationMetaData>().compile(
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

export const lessonPatchTagValidator = vine.withMetaData<OrganizationMetaData>().compile(
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

export const lessonNotesValidator = vine.compile(
  vine.object({
    notes: vine.string().nullable(),
  })
)

export const lessonOrderValidator = vine.compile(
  vine.object({
    modules: vine.array(
      vine.object({
        id: vine.number(),
        lessons: vine.array(vine.number()),
      })
    ),
  })
)

export const lessonsFilterValidatorObject = vine
  .object({
    page: vine.number().positive().optional(),
    perPage: vine.number().positive().optional(),
    name: StringFilter.rule,
    statusId: NumbersFilter.rule,
    accessLevelId: NumbersFilter.rule,
    publishAt: vine
      .object({
        before: vine.date({ formats: { utc: true } }).optional(),
        after: vine.date({ formats: { utc: true } }).optional(),
      })
      .optional(),
  })
  .optional()

export const lessonsFilterValidator = vine.compile(lessonsFilterValidatorObject)
