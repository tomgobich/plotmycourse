import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string(),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail().in(['tom@adocasts.com']),
    password: vine.string().minLength(8),
  })
)
