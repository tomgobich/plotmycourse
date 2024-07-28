import User from '#models/user'
import env from '#start/env'
import string from '@adonisjs/core/helpers/string'
import encryption from '@adonisjs/core/services/encryption'
import router from '@adonisjs/core/services/router'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'
import ExpirePasswordResetTokens from './expire_password_reset_tokens.js'

type Params = {
  email: string
}

export default class TrySendPasswordResetEmail {
  static async handle({ email }: Params) {
    const user = await User.query().whereILike('email', email).first()
    const hash = string.generateRandom(16)

    // silently fail if email does not exist
    if (!user) return

    await ExpirePasswordResetTokens.handle({ user })
    await user.related('passwordResetTokens').create({
      hash,
      expiresAt: DateTime.now().plus({ hour: 1 }),
    })

    const encryptedHash = encryption.encrypt(hash)
    const resetLink = router
      .builder()
      .prefixUrl(env.get('APP_URL'))
      .params({ hash: encryptedHash })
      .make('forgot_password.reset')

    await mail.send((message) => {
      message
        .subject('Reset Your PlotMyCourse Password')
        .to(user.email)
        .html(
          `Please reset your PlotMyCourse password by <a href="${resetLink}">clicking here</a>.`
        )
    })
  }
}
