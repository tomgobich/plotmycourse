import factory from '@adonisjs/lucid/factories'
import Difficulty from '#models/difficulty'

export const DifficultyFactory = factory
  .define(Difficulty, async () => {
    return {}
  })
  .build()
