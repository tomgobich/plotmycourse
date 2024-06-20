import factory from '@adonisjs/lucid/factories'
import Course from '#models/course'

export const CourseFactory = factory
  .define(Course, async ({ faker }) => {
    return {}
  })
  .build()