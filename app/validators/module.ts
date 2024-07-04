import vine from '@vinejs/vine'

export const modulePatchTagValidator = vine.compile(
  vine.object({
    statusId: vine.number(),
  })
)
