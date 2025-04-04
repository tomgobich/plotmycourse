import Course from '#models/course'
import Organization from '#models/organization'
import { lessonOrderValidator } from '#validators/lesson'
import db from '@adonisjs/lucid/services/db'
import { Infer } from '@vinejs/vine/types'

type SortData = Infer<typeof lessonOrderValidator>

type Params = {
  organization: Organization
  courseId: number
  data: SortData
}

type LessonFlatData = {
  id: number
  moduleId: number
  order: number
}

export default class UpdateLessonOrder {
  static async handle({ organization, courseId, data }: Params) {
    const course = await organization.findCourse(courseId)
    const lessons = await this.#getLessons(course)
    const lessonsData = this.#flattenData(data)

    return db.transaction(async (trx) => {
      const promises = lessonsData.map(({ id, moduleId, order }) => {
        const lesson = lessons.find((lesson) => lesson.id === id)
        const isSame = lesson?.order === order && lesson?.moduleId === moduleId

        if (!lesson || isSame) {
          return
        }

        lesson.useTransaction(trx)

        return lesson.merge({ moduleId, order }).save()
      })

      return Promise.all(promises)
    })
  }

  static async #getLessons(course: Course) {
    return course.related('lessons').query().select('id', 'moduleId', 'order')
  }

  static #flattenData(data: SortData) {
    return data.modules.reduce<LessonFlatData[]>((lessons, module) => {
      const moduleLessons = module.lessons.map((id, index) => ({
        id,
        moduleId: module.id,
        order: index,
      }))

      return [...lessons, ...moduleLessons]
    }, [])
  }
}
