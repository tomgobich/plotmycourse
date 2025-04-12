import { BaseDto } from '@adocasts.com/dto/base'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import { ApiProperty, ApiPropertyOptional } from '@foadonis/openapi/decorators'

export default class AccessTokenDto extends BaseDto {
  
  @ApiProperty()
  id: number | string | BigInt
  
  @ApiProperty()
  type: string
  
  @ApiPropertyOptional()
  name: string | null
  
  @ApiPropertyOptional()
  token: string | undefined
  
  @ApiProperty()
  abilities: string[]
  
  @ApiPropertyOptional()
  lastUsedAt?: string
  
  @ApiPropertyOptional()
  expiresAt?: string
  
  @ApiProperty()
  createdAt: string
  
  @ApiProperty()
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
