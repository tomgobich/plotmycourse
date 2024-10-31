import type { HttpContext } from '@adonisjs/core/http'
import AccessLevelDto from '#dtos/access_level'
import AuthorizeToken from '#actions/abilities/authorize_token'
import TokenActions from '#enums/token_actions'

export default class AccessLevelsController {
  /**
   * Display a list of resource
   */
  async index({ organization }: HttpContext) {
    AuthorizeToken.action({ organization, action: TokenActions.READ })

    const accessLevels = await organization
      .getAccessLevels()
      .withCount('courses')
      .withCount('lessons')

    return AccessLevelDto.fromArray(accessLevels)
  }

  /**
   * Handle form submission for the create action
   */
  async store({}: HttpContext) {}

  /**
   * Show individual record
   */
  async show({}: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({}: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({}: HttpContext) {}
}
