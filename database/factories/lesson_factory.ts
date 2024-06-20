import factory from '@adonisjs/lucid/factories'
import Lesson from '#models/lesson'

export const LessonFactory = factory
  .define(Lesson, async ({ faker }) => {
    return {}
  })
  .build()