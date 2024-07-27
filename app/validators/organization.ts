import vine from '@vinejs/vine'
import { emailRule } from './auth.js'
import { OrganizationMetData } from './helpers/organization.js'

export const organizationValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(100),
  })
)

export const organizationInviteValidator = vine.withMetaData<OrganizationMetData>().compile(
  vine.object({
    email: emailRule().unique(async (db, value, field) => {
      const match = await db
        .from('organization_pending_users')
        .where('organization_id', field.meta.organizationId)
        .where('email', value)
        .whereNull('accepted_at')
        .select('id')
        .first()

      return !match
    }),
    roleId: vine.number().exists(async (db, value) => {
      const match = await db.from('roles').where('id', value).select('id').first()
      return !!match
    }),
  })
)
