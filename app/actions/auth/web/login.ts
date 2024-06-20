import User from '#models/user'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'

export type LoginData = {
  email: string
  password: string
}

export default class Login {
  async handle(auth: Authenticator<Authenticators>, { email, password }: LoginData) {
    const user = await User.verifyCredentials(email, password)

    await auth.use('web').login(user)

    return user
  }
}
