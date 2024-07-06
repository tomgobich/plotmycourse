import Organization from '#models/organization'
import db from '@adonisjs/lucid/services/db'

type Params = {
  organization: Organization
  courseId: number
  id: number
}

export default class DestroyModule {
  static async handle({ organization, courseId, id }: Params) {
    const course = await organization.findCourse(courseId)
    const module = await course.findModule(id)

    await db.transaction(async (trx) => {
      course.useTransaction(trx)
      module.useTransaction(trx)

      await module.delete()
      await course.related('modules').query().where('order', '>', module.order).decrement('order')
    })

    return module
  }
}
