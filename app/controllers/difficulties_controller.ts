import DifficultyDto from '#dtos/difficulty'
import type { HttpContext } from '@adonisjs/core/http'

export default class DifficultiesController {
  /**
   * Display a list of resource
   */
  async index({ inertia, organization }: HttpContext) {
    const difficulties = await organization.related('difficulties').query().orderBy('order')
    return inertia.render('difficulties/index', {
      difficulties: DifficultyDto.fromArray(difficulties),
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Handle reordering of difficulties
   */
  async order({ request, response }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
