import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import axios from 'axios'
import app from '@adonisjs/core/services/app'

export default class TurnstileMiddleware {
  async handle({ request, response, session, logger }: HttpContext, next: NextFn) {
    if (app.inDev || session.get('TURNSTILE_STATUS') === 'true') {
      return next()
    }

    const token = request.input('turnstile')
    const ip = request.header('CF-Connecting-IP')

    const { data } = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      secret: env.get('TURNSTILE_SECRET_KEY'),
      response: token,
      remoteip: ip,
    })

    logger.info(`TURNSTILE: ${ip} - ${data.success}`)
    session.put('TURNSTILE_STATUS', data.success)

    if (!data.success) {
      session.flash(
        'error',
        'Your request has been flagged by Cloudflare and has not been processed'
      )

      return response.redirect().back()
    }

    const output = await next()
    return output
  }
}
