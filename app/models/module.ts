import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Course from './course.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Lesson from './lesson.js'
import Status from '#models/status'
import { compose } from '@adonisjs/core/helpers'
import { WithOrganization } from '#models/mixins/with_organization'

export default class Module extends compose(BaseModel, WithOrganization) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare courseId: number

  @column()
  declare statusId: number

  @column()
  declare name: string

  @column()
  declare notes: string | null

  @column()
  declare order: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Course)
  declare course: BelongsTo<typeof Course>

  @belongsTo(() => Status)
  declare status: BelongsTo<typeof Status>

  @hasMany(() => Lesson)
  declare lessons: HasMany<typeof Lesson>

  async findNextSort() {
    return Module.findNextSort(this.id)
  }

  static async findNextSort(moduleId: number) {
    const lastLesson = await Lesson.query()
      .where({ moduleId })
      .select('order')
      .orderBy('order', 'desc')
      .first()

    // start lessons at 0
    return lastLesson ? lastLesson.order + 1 : 0
  }

  async findLesson(lessonId: number) {
    return await (<Module>this).related('lessons').query().where('id', lessonId).firstOrFail()
  }
}
