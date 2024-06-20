import User from '#models/user'

export default class GetActiveForUser {
  async handle(user: User, activeId?: number | string) {
    return user
      .related('organizations')
      .query()
      .if(activeId, (query) => query.where('organizations.id', activeId!))
      .firstOrFail()
  }
}
