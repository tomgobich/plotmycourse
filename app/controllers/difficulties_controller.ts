import CreateDifficulty from '#actions/difficulties/create_difficulty'
import UpdateDifficulty from '#actions/difficulties/update_difficulty'
import DifficultyDto from '#dtos/difficulty'
import { difficultyValidator } from '#validators/difficulty'
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
  async store({ request, response, organization }: HttpContext) {
    const data = await request.validateUsing(difficultyValidator)

    await CreateDifficulty.handle({ organization, data })

    return response.redirect().back()
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, organization }: HttpContext) {
    const data = await request.validateUsing(difficultyValidator)

    await UpdateDifficulty.handle({
      id: params.id,
      organization,
      data,
    })

    return response.redirect().back()
  }

  /**
   * Handle reordering of difficulties
   */
  async order({ request, response }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
