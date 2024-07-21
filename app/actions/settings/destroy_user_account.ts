import Organization from '#models/organization'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

type Params = {
  user: User
}

export default class DestroyUserAccount {
  static async handle({ user }: Params) {
    await db.transaction(async (trx) => {
      user.useTransaction(trx)

      await this.#deleteDanglingOrganizations(user)
      await user.delete()
    })
  }

  /**
   * delete organizations that'll be left dangling (no other users) when the user is deleted
   * @param user
   * @returns
   */
  static async #deleteDanglingOrganizations(user: User) {
    return Organization.query()
      .whereHas('users', (query) => query.where('users.id', user.id))
      .whereDoesntHave('users', (query) => query.whereNot('users.id', user.id))
      .delete()
  }
}
