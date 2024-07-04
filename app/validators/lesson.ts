import vine from '@vinejs/vine'

export const lessonPatchTagValidator = vine.compile(
  vine.object({
    statusId: vine.number().optional().requiredIfMissing(['accessLevelId']),
    accessLevelId: vine.number().optional().requiredIfMissing(['statusId']),
  })
)
