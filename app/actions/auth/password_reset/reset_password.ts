import { Infer } from '@vinejs/vine/types'
import { passwordResetValidator } from '#validators/auth'
import VerifyPasswordResetToken from '#actions/auth/password_reset/verify_password_reset_token'
import UnauthorizedException from '#exceptions/unauthorized_exception'
import ExpirePasswordResetTokens from './expire_password_reset_tokens.js'

export default class ResetPassword {
  static async handle({ hash, password }: Infer<typeof passwordResetValidator>) {
    const { isValid, user } = await VerifyPasswordResetToken.handle({ encryptedHash: hash })

    if (!isValid) {
      throw new UnauthorizedException('The password reset token provided is invalid or expired')
    }

    await user!.merge({ password }).save()
    await ExpirePasswordResetTokens.handle({ user: user! })

    return user!
  }
}
