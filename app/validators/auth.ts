import vine from '@vinejs/vine'

export const emailRule = () => vine.string().email().normalizeEmail()

export const loginValidator = vine.compile(
  vine.object({
    email: emailRule(),
    password: vine.string(),
    remember: vine.boolean().optional(),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string(),
    email: emailRule().in(['tom@adocasts.com']),
    password: vine.string().minLength(8),
  })
)
