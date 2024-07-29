import User from '#models/user'
import { Infer } from '@vinejs/vine/types'
import mail from '@adonisjs/mail/services/main'
import db from '@adonisjs/lucid/services/db'
import { updateEmailValidator } from '#validators/setting'

type Params = {
  user: User
  data: Infer<typeof updateEmailValidator>
}

export default class UpdateUserEmail {
  static async handle({ user, data }: Params) {
    const emailOld = user.email

    // verify the password is correct for auth user
    await User.verifyCredentials(emailOld, data.password)

    await db.transaction(async (trx) => {
      user.useTransaction(trx)

      user.email = data.email

      await user.save()

      await user.related('emailHistories').create({
        emailNew: data.email,
        emailOld,
      })
    })

    await this.#sendEmailNotification(user, emailOld)

    return user
  }

  static async #sendEmailNotification(user: User, emailOld: string) {
    await mail.sendLater((message) => {
      message
        .to(emailOld)
        .subject('Your email has been successfully changed')
        .htmlView('emails/email_change', { user })
    })
  }
}
