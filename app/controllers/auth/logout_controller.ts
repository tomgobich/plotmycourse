import WebLogout from '#actions/auth/http/web_logout'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class LogoutController {
  @inject()
  async handle({ response }: HttpContext, webLogout: WebLogout) {
    await webLogout.handle()

    return response.redirect().toRoute('login.show')
  }
}
