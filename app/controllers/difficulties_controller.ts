import CreateDifficulty from '#actions/difficulties/create_difficulty'
import DestroyDifficulty from '#actions/difficulties/destroy_difficulty'
import UpdateDifficulty from '#actions/difficulties/update_difficulty'
import UpdateDifficultyOrder from '#actions/difficulties/update_difficulty_order'
import DifficultyDto from '#dtos/difficulty'
import { difficultyOrderValidator, difficultyValidator } from '#validators/difficulty'
import type { HttpContext } from '@adonisjs/core/http'

export default class DifficultiesController {
  /**
   * Display a list of resource
   */
  async index({ inertia, organization }: HttpContext) {
    const difficulties = await organization.getDifficulties()
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
  async order({ request, response, organization }: HttpContext) {
    const { ids } = await request.validateUsing(difficultyOrderValidator)

    await UpdateDifficultyOrder.handle({
      organization,
      ids,
    })

    return response.redirect().back()
  }

  /**
   * Delete record
   */
  async destroy({ params, response, organization }: HttpContext) {
    await DestroyDifficulty.handle({
      id: params.id,
      organization,
    })

    return response.redirect().back()
  }
}
