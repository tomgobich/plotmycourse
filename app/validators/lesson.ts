import vine from '@vinejs/vine'

export const lessonValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(150),
    accessLevelId: vine.number(),
    statusId: vine.number(),
  })
)

export const lessonPatchTagValidator = vine.compile(
  vine.object({
    statusId: vine.number().optional().requiredIfMissing(['accessLevelId']),
    accessLevelId: vine.number().optional().requiredIfMissing(['statusId']),
  })
)

export const lessonOrderValidator = vine.compile(
  vine.object({
    modules: vine.array(
      vine.object({
        id: vine.number(),
        lessons: vine.array(vine.number()),
      })
    ),
  })
)
