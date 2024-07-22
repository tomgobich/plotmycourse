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

    await this.#sendEmailNotification(emailOld, data.email)

    return user
  }

  static async #sendEmailNotification(emailOld: string, emailNew: string) {
    await mail.sendLater((message) => {
      message.to(emailOld).subject('Your email has been successfully changed').html(`
          <p>Your PlotMyCourse email has been updated</p>
          <p>Old Email: ${emailOld}</p>
          <p>New Email: ${emailNew}</p>
          <hr />
          <p>If this is incorrect, please contact support</p>  
        `)
    })
  }
}
