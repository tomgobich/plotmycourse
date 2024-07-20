import factory from '@adonisjs/lucid/factories'
import Lesson from '#models/lesson'

export const LessonFactory = factory
  .define(Lesson, async () => {
    return {}
  })
  .build()
