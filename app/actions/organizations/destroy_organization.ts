import User from '#models/user'

type Params = {
  user: User
  id: number
}

export default class DestroyOrganization {
  static async handle({ user, id }: Params) {
    const organization = await user.findOrganization(id)

    await organization.delete()

    return organization
  }
}
