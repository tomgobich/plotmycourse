import vine from '@vinejs/vine'

export const coursePatchTagValidator = vine.compile(
  vine.object({
    statusId: vine.number().optional().requiredIfMissing(['difficultyId', 'accessLevelId']),
    difficultyId: vine.number().optional().requiredIfMissing(['statusId', 'accessLevelId']),
    accessLevelId: vine.number().optional().requiredIfMissing(['statusId', 'difficultyId']),
  })
)
