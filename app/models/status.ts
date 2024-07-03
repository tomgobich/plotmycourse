import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Lesson from './lesson.js'
import Course from '#models/course'
import Module from '#models/module'
import { compose } from "@adonisjs/core/helpers";
import { WithOrganization } from "#models/mixins/with_organization";

export default class Status extends compose(BaseModel, WithOrganization) {
  @column({ isPrimary: true })
  declare id: number

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

  @hasMany(() => Course)
  declare course: HasMany<typeof Course>

  @hasMany(() => Module)
  declare module: HasMany<typeof Module>

  @hasMany(() => Lesson)
  declare lessons: HasMany<typeof Lesson>
}
