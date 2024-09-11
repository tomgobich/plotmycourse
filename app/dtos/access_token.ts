import { BaseDto } from '@adocasts.com/dto/base'
import { AccessToken } from '@adonisjs/auth/access_tokens'

export default class AccessTokenDto extends BaseDto {
  id: number | string | BigInt
  type: string
  name: string | null
  token: string | undefined
  abilities: string[]
  lastUsedAt?: string
  expiresAt?: string
  createdAt: string
  updatedAt: string

  constructor(accessToken: AccessToken) {
    super()

    this.id = accessToken.identifier
    this.type = accessToken.type
    this.name = accessToken.name
    this.token = accessToken.value?.release()
    this.abilities = accessToken.abilities
    this.lastUsedAt = accessToken.lastUsedAt?.toISOString()
    this.expiresAt = accessToken.expiresAt?.toISOString()
    this.createdAt = accessToken.createdAt?.toISOString()
    this.updatedAt = accessToken.updatedAt?.toISOString()
  }
}
