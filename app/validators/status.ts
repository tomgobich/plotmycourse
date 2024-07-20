import vine from '@vinejs/vine'

export const statusValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(50),
    color: vine.string().maxLength(20),
  })
)

export const statusOrderValidator = vine.compile(
  vine.object({
    ids: vine.array(vine.number()),
  })
)
