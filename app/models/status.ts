import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, computed, hasMany } from '@adonisjs/lucid/orm'
import Organization from './organization.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Lesson from './lesson.js'
import Course from '#models/course'
import Module from '#models/module'

export default class Status extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare organizationId: number

  @column()
  declare name: string

  @column()
  declare color: string

  @column()
  declare order: number

  @column()
  declare isDefault: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @hasMany(() => Course)
  declare course: HasMany<typeof Course>

  @hasMany(() => Module)
  declare module: HasMany<typeof Module>

  @hasMany(() => Lesson)
  declare lessons: HasMany<typeof Lesson>
}
