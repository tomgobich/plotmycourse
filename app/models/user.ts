import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Organization from './organization.js'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import EmailHistory from './email_history.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => EmailHistory)
  declare emailHistories: HasMany<typeof EmailHistory>

  @manyToMany(() => Organization, {
    pivotColumns: ['role_id'],
    pivotTable: 'organization_users',
  })
  declare organizations: ManyToMany<typeof Organization>

  async findOrganization(id: number) {
    return (<User>this).related('organizations').query().where('organizations.id', id).firstOrFail()
  }

  getOrganizations() {
    return (<User>this).related('organizations').query()
  }
}
