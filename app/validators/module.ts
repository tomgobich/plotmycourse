import vine from '@vinejs/vine'

export const moduleValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(100),
    statusId: vine.number(),
  })
)

export const modulePatchTagValidator = vine.compile(
  vine.object({
    statusId: vine.number(),
  })
)
