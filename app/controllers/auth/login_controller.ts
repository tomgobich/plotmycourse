import { loginValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import Login from '#actions/auth/web/login'

export default class LoginController {
  async show({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  @inject()
  async store({ request, response, auth }: HttpContext, login: Login) {
    const data = await request.validateUsing(loginValidator)

    await login.handle(auth, data)

    return response.redirect().toRoute('home')
  }
}
