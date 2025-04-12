import TokenActions from '#enums/token_actions'
import UnauthorizedException from '#exceptions/unauthorized_exception'
import Organization from '#models/organization'

type Params = {
  organization: Organization
  action: TokenActions
}

export default class AuthorizeToken {
  static read(organization: Organization) {
    return this.action({ organization, action: TokenActions.READ })
  }

  static create(organization: Organization) {
    return this.action({ organization, action: TokenActions.CREATE })
  }

  static update(organization: Organization) {
    return this.action({ organization, action: TokenActions.UPDATE })
  }

  static delete(organization: Organization) {
    return this.action({ organization, action: TokenActions.DELETE })
  }

  static action({ organization, action }: Params) {
    if (!organization.currentAccessToken?.allows(action)) {
      throw new UnauthorizedException(
        `The provided token does not have permission to ${action} in this organization.`
      )
    }
  }
}
