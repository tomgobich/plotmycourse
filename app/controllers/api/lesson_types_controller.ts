import type { HttpContext } from '@adonisjs/core/http'
import LessonTypeDto from '#dtos/lesson_type'
import AuthorizeToken from '#actions/abilities/authorize_token'
import TokenActions from '#enums/token_actions'

export default class LessonTypesController {
  /**
   * Display a list of resource
   */
  async index({ organization }: HttpContext) {
    AuthorizeToken.action({ organization, action: TokenActions.READ })

    const lessonTypes = await organization.getLessonTypes().withCount('lessons')

    return LessonTypeDto.fromArray(lessonTypes)
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
