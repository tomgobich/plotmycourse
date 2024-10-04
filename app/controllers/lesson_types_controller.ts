import DestroyLessonType from '#actions/lesson_types/destroy_lesson_type'
import StoreLessonType from '#actions/lesson_types/store_lesson_type'
import UpdateLessonType from '#actions/lesson_types/update_lesson_type'
import UpdateLessonTypeOrder from '#actions/lesson_types/update_lesson_type_order'
import LessonTypeDto from '#dtos/lesson_type'
import {
  lessonTypeDestroyValidator,
  lessonTypeOrderValidator,
  lessonTypeValidator,
} from '#validators/lesson_type'
import type { HttpContext } from '@adonisjs/core/http'

export default class LessonTypesController {
  /**
   * Display a list of resource
   */
  async index({ inertia, organization }: HttpContext) {
    const lessonTypes = await organization.getLessonTypes().withCount('lessons')

    return inertia.render('lesson_types/index', {
      lessonTypes: LessonTypeDto.fromArray(lessonTypes),
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, organization }: HttpContext) {
    const data = await request.validateUsing(lessonTypeValidator)

    await StoreLessonType.handle({ organization, data })

    return response.redirect().back()
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, organization }: HttpContext) {
    const data = await request.validateUsing(lessonTypeValidator)

    await UpdateLessonType.handle({
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
    const { ids } = await request.validateUsing(lessonTypeOrderValidator)

    await UpdateLessonTypeOrder.handle({
      organization,
      ids,
    })

    return response.redirect().back()
  }

  /**
   * Delete record
   */
  async destroy({ params, request, response, organization }: HttpContext) {
    const data = await request.validateUsing(
      lessonTypeDestroyValidator,
      withOrganizationMetaData(organization.id)
    )

    await DestroyLessonType.handle({
      id: params.id,
      organization,
      data,
    })

    return response.redirect().back()
  }
}
