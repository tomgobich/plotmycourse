import factory from '@adonisjs/lucid/factories'
import Status from '#models/status'

export const StatusFactory = factory
  .define(Status, async () => {
    return {}
  })
  .build()
