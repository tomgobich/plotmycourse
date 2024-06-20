import factory from '@adonisjs/lucid/factories'
import Module from '#models/module'

export const ModuleFactory = factory
  .define(Module, async ({ faker }) => {
    return {}
  })
  .build()