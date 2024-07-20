import factory from '@adonisjs/lucid/factories'
import AccessLevel from '#models/access_level'

export const AccessLevelFactory = factory
  .define(AccessLevel, async () => {
    return {}
  })
  .build()
