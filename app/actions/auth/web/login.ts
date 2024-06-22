import User from '#models/user'
import { loginValidator } from '#validators/auth'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'
import { Infer } from '@vinejs/vine/types'

type Params = {
  auth: Authenticator<Authenticators>
  data: Infer<typeof loginValidator>
}

export default class Login {
  static async handle({ auth, data }: Params) {
    const user = await User.verifyCredentials(data.email, data.password)

    await auth.use('web').login(user)

    return user
  }
}
