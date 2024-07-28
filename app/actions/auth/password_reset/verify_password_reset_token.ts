import PasswordResetToken from '#models/password_reset_token'
import encryption from '@adonisjs/core/services/encryption'

type Params = {
  encryptedHash: string
}

export default class VerifyPasswordResetToken {
  static async handle({ encryptedHash }: Params) {
    const hash = encryption.decrypt(encryptedHash)
    const token = await PasswordResetToken.findBy({ hash })
    const user = await token?.related('user').query().first()

    return {
      isValid: token?.isValid,
      token,
      user,
    }
  }
}
