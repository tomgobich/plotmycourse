import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Course from './course.js'
import Module from './module.js'
import Lesson from './lesson.js'
import AccessLevel from './access_level.js'
import Difficulty from './difficulty.js'
import Status from './status.js'
import User from './user.js'
import type { ExtractModelRelations, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import OrganizationInvite from './organization_invite.js'

export default class Organization extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Course)
  declare courses: HasMany<typeof Course>

  @hasMany(() => Module)
  declare modules: HasMany<typeof Module>

  @hasMany(() => Lesson)
  declare lessons: HasMany<typeof Lesson>

  @hasMany(() => AccessLevel)
  declare accessLevels: HasMany<typeof AccessLevel>

  @hasMany(() => Difficulty)
  declare difficulties: HasMany<typeof Difficulty>

  @hasMany(() => Status)
  declare statuses: HasMany<typeof Status>

  @manyToMany(() => User, {
    pivotColumns: ['role_id'],
    pivotTable: 'organization_users',
  })
  declare users: ManyToMany<typeof User>

  @hasMany(() => OrganizationInvite)
  declare invites: HasMany<typeof OrganizationInvite>

  async findNextSort(type: ExtractModelRelations<Organization> = 'courses') {
    switch (type) {
      case 'courses':
        const lastCourse = await (<Organization>this)
          .related('courses')
          .query()
          .orderBy('order', 'desc')
          .first()

        return lastCourse ? lastCourse.order + 1 : 1
      case 'lessons':
        const lastLesson = await (<Organization>this)
          .related('lessons')
          .query()
          .whereNull('moduleId')
          .orderBy('order', 'desc')
          .first()

        return lastLesson ? lastLesson.order + 1 : 1
      case 'users':
        return 0
      default:
        const lastest = await (<Organization>this)
          .related(type)
          .query()
          .orderBy('order', 'desc')
          .first()

        return lastest ? lastest.order + 1 : 0
    }
  }

  async findCourse(courseId: number) {
    return (<Organization>this).related('courses').query().where('id', courseId).firstOrFail()
  }

  async findModule(moduleId: number) {
    return (<Organization>this).related('modules').query().where('id', moduleId).firstOrFail()
  }

  async findLesson(lessonId: number) {
    return (<Organization>this).related('lessons').query().where('id', lessonId).firstOrFail()
  }

  async getDifficulties() {
    return (<Organization>this).related('difficulties').query().orderBy('order')
  }

  async getStatuses() {
    return (<Organization>this).related('statuses').query().orderBy('order')
  }

  async getAccessLevels() {
    return (<Organization>this).related('accessLevels').query().orderBy('order')
  }
}
