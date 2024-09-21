import vine from '@vinejs/vine'
import { existsInOrganization, OrganizationMetaData } from './helpers/organization.js'
import NumbersFilter from '#actions/filters/numbers_filter'
import StringFilter from '#actions/filters/string_filter'
import { lessonsFilterValidatorObject } from './lesson.js'

export const moduleValidator = vine.withMetaData<OrganizationMetaData>().compile(
  vine.object({
    name: vine.string().maxLength(100),
    statusId: vine.number().exists(existsInOrganization('statuses')),
  })
)

export const modulePatchTagValidator = vine.withMetaData<OrganizationMetaData>().compile(
  vine.object({
    statusId: vine.number().exists(existsInOrganization('statuses')),
  })
)

export const moduleOrderValidator = vine.compile(
  vine.object({
    ids: vine.array(vine.number()),
  })
)

export const modulesFilterValidatorObject = vine
  .object({
    name: StringFilter.rule,
    statusId: NumbersFilter.rule,
    excludeEmpty: vine.boolean().optional(),
  })
  .optional()

export const moudlesFilterValidator = vine.compile(
  vine.object({
    modules: modulesFilterValidatorObject,
    lessons: lessonsFilterValidatorObject,
    excludeLessons: vine.boolean().optional(),
  })
)
