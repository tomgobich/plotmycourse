import type { HttpContext } from '@adonisjs/core/http'
import DifficultyDto from '#dtos/difficulty'
import AuthorizeToken from '#actions/abilities/authorize_token'
import TokenActions from '#enums/token_actions'

export default class DifficultiesController {
  /**
   * Display a list of resource
   */
  async index({ organization }: HttpContext) {
    AuthorizeToken.action({ organization, action: TokenActions.READ })

    const difficulties = await organization.getDifficulties().withCount('courses')

    return DifficultyDto.fromArray(difficulties)
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
