import vine from '@vinejs/vine'

export const courseValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(150),
    statusId: vine.number(),
    difficultyId: vine.number(),
    accessLevelId: vine.number(),
    notes: vine.string().optional(),
  })
)

export const coursePatchTagValidator = vine.compile(
  vine.object({
    statusId: vine.number().optional().requiredIfMissing(['difficultyId', 'accessLevelId']),
    difficultyId: vine.number().optional().requiredIfMissing(['statusId', 'accessLevelId']),
    accessLevelId: vine.number().optional().requiredIfMissing(['statusId', 'difficultyId']),
  })
)
