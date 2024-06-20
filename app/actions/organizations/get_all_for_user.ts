import User from '#models/user'

export default class GetAllForUser {
  async handle(user: User) {
    return user.related('organizations').query().orderBy('name')
  }
}
