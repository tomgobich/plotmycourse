import TokenActions from '#enums/token_actions'
import UnauthorizedException from '#exceptions/unauthorized_exception'
import Organization from '#models/organization'

type Params = {
  organization: Organization
  action: TokenActions
}

export default class AuthorizeToken {
  static action({ organization, action }: Params) {
    if (!organization.currentAccessToken?.allows(action)) {
      throw new UnauthorizedException(
        `The provided token does not have permission to ${action} in this organization.`
      )
    }
  }
}
