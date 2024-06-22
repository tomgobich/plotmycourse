import vine from '@vinejs/vine'

export const difficultyValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(50),
    color: vine.string().maxLength(20),
  })
)

export const difficultyOrderValidator = vine.compile(
  vine.object({
    ids: vine.array(vine.number()),
  })
)
