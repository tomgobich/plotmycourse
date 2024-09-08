import { BaseDto } from '@adocasts.com/dto/base'
import { AccessToken } from '@adonisjs/auth/access_tokens'

export default class AccessTokenDto extends BaseDto {
  type: string
  name: string | null
  token: string | undefined
  abilities: string[]
  lastUsedAt: Date | null
  expiresAt: Date | null

  constructor(accessToken: AccessToken) {
    super()

    this.type = accessToken.type
    this.name = accessToken.name
    this.token = accessToken.value?.release()
    this.abilities = accessToken.abilities
    this.lastUsedAt = accessToken.lastUsedAt
    this.expiresAt = accessToken.expiresAt
  }
}
