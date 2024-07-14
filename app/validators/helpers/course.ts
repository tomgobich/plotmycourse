import { Database } from '@adonisjs/lucid/database'
import { FieldContext } from '@vinejs/vine/types'

export type CourseMetaData = {
  courseId: number
}

export function withCourseMetaData(id: number) {
  return {
    meta: {
      courseId: id,
    },
  }
}

export function existsInCourse(table: string, column: string = 'id') {
  return async (db: Database, value: number | string, field: FieldContext) => {
    const result = await db
      .from(table)
      .select(column)
      .where(column, value)
      .where('course_id', field.meta.organizationId)
      .first()

    return !!result
  }
}
