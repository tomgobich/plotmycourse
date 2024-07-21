import vine from '@vinejs/vine'

export const accessLevelValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(50),
    color: vine.string().maxLength(20).hexCode(),
  })
)

export const accessLevelOrderValidate = vine.compile(
  vine.object({
    ids: vine.array(vine.number()),
  })
)
