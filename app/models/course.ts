import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, hasManyThrough, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasManyThrough } from '@adonisjs/lucid/types/relations'
import AccessLevel from './access_level.js'
import Difficulty from './difficulty.js'
import Module from './module.js'
import Lesson from './lesson.js'
import Status from '#models/status'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { compose } from "@adonisjs/core/helpers";
import { WithOrganization } from "#models/mixins/with_organization";

export default class Course extends compose(BaseModel, WithOrganization) {
  serializeExtras = true

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare accessLevelId: number

  @column()
  declare difficultyId: number

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

  @belongsTo(() => AccessLevel)
  declare accessLevel: BelongsTo<typeof AccessLevel>

  @belongsTo(() => Difficulty)
  declare difficulty: BelongsTo<typeof Difficulty>

  @belongsTo(() => Status)
  declare status: BelongsTo<typeof Status>

  @hasMany(() => Module)
  declare modules: HasMany<typeof Module>

  @hasManyThrough([() => Lesson, () => Module])
  declare lessons: HasManyThrough<typeof Lesson>

  static withStatusCounts = scope<
    typeof Course,
    (query: ModelQueryBuilderContract<typeof Course>, statuses: Status[]) => void
  >((query, statuses: Status[]) => {
    statuses.map((status) => {
      query.withCount('lessons', (lessons) => lessons.where('statusId', status.id).as(status.name))
    })
  })

  async findNextSort() {
    const lastCourse = await (<Course>this)
      .related('modules')
      .query()
      .orderBy('order', 'desc')
      .first()

    // start modules at 1
    return lastCourse ? lastCourse.order + 1 : 1
  }

  async findModule(moduleId: number) {
    return (<Course>this).related('modules').query().where('id', moduleId).firstOrFail()
  }
}
