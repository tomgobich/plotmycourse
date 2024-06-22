import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import Login from '#actions/auth/web/login'

export default class LoginController {
  async show({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(loginValidator)

    await Login.handle({ auth, data })

    return response.redirect().toRoute('home')
  }
}
