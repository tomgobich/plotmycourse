import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Organization from './organization.js'
import Course from './course.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Lesson from './lesson.js'
import Status from '#models/status'

export default class Module extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare organizationId: number

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

  @column.dateTime()
  declare archivedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @belongsTo(() => Course)
  declare course: BelongsTo<typeof Course>

  @belongsTo(() => Status)
  declare status: BelongsTo<typeof Status>

  @hasMany(() => Lesson)
  declare lessons: HasMany<typeof Lesson>

  async findNextSort() {
    const lastCourse = await (<Module>this)
      .related('lessons')
      .query()
      .orderBy('order', 'desc')
      .first()

    // start lessons at 0
    return lastCourse ? lastCourse.order + 1 : 0
  }

  async findLesson(lessonId: number) {
    return await (<Module>this).related('lessons').query().where('id', lessonId).firstOrFail()
  }
}
