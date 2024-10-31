import type { HttpContext } from '@adonisjs/core/http'
import StatusDto from '#dtos/status'
import AuthorizeToken from '#actions/abilities/authorize_token'
import TokenActions from '#enums/token_actions'

export default class StatusesController {
  /**
   * Display a list of resource
   */
  async index({ organization }: HttpContext) {
    AuthorizeToken.action({ organization, action: TokenActions.READ })

    const statuses = await organization
      .getStatuses()
      .withCount('course')
      .withCount('module')
      .withCount('lessons')

    return StatusDto.fromArray(statuses)
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
