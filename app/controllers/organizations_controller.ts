import GetActiveForUser from '#actions/organizations/get_active_for_user'
import { activeCookieName } from '#config/organization'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class OrganizationsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  @inject()
  async active({ response, params, auth }: HttpContext, getActiveForUser: GetActiveForUser) {
    const organization = await getActiveForUser.handle(auth.user!, params.id)

    response.cookie(activeCookieName, organization.id)

    return response.redirect().back()
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
