import Organization from '#models/organization'
import db from '@adonisjs/lucid/services/db'

type Params = {
  organization: Organization
  moduleId?: number
  id: number
}

export default class DestroyLesson {
  static async handle(params: Params) {
    return params.moduleId ? this.#destroyFromModule(params) : this.#destroyStandalone(params)
  }

  static async #destroyFromModule({ organization, moduleId, id }: Params) {
    const module = await organization.findModule(moduleId!)
    const lesson = await module.findLesson(id)

    await db.transaction(async (trx) => {
      module.useTransaction(trx)
      lesson.useTransaction(trx)

      await lesson.delete()
      await module.related('lessons').query().where('order', '>', lesson.order).decrement('order')
    })

    return lesson
  }

  static async #destroyStandalone({ organization, id }: Params) {
    const lesson = await organization.findLesson(id)

    await db.transaction(async (trx) => {
      lesson.useTransaction(trx)

      await lesson.delete()
      await organization
        .related('lessons')
        .query()
        .whereNull('moduleId')
        .where('order', '>', lesson.order)
        .decrement('order')
    })

    return lesson
  }
}
