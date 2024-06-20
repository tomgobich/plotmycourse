import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Module from '#models/module'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Status from './status.js'
import Organization from './organization.js'
import AccessLevel from './access_level.js'

export default class Lesson extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare organizationId: number

  @column()
  declare accessLevelId: number

  @column()
  declare moduleId: number

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

  @belongsTo(() => Module)
  declare module: BelongsTo<typeof Module>

  @belongsTo(() => Status)
  declare status: BelongsTo<typeof Status>

  @belongsTo(() => AccessLevel)
  declare accessLevel: BelongsTo<typeof AccessLevel>
}
