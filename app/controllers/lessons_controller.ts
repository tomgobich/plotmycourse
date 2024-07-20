import DestroyLesson from '#actions/lessons/destroy_lesson'
import StoreLesson from '#actions/lessons/store_lesson'
import UpdateLesson from '#actions/lessons/update_lesson'
import UpdateLessonOrder from '#actions/lessons/update_lesson_order'
import UpdateLessonTag from '#actions/lessons/update_lesson_tag'
import { withOrganizationMetaData } from '#validators/helpers/organization'
import { lessonOrderValidator, lessonPatchTagValidator, lessonValidator } from '#validators/lesson'
import type { HttpContext } from '@adonisjs/core/http'

export default class LessonsController {
  /**
   * Handle form submission for the create action
   */
  async store({ params, request, response, organization }: HttpContext) {
    const data = await request.validateUsing(
      lessonValidator,
      withOrganizationMetaData(organization.id)
    )

    await StoreLesson.handle({
      moduleId: params.moduleId,
      organization,
      data,
    })

    return response.redirect().back()
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, organization }: HttpContext) {
    const data = await request.validateUsing(
      lessonValidator,
      withOrganizationMetaData(organization.id)
    )

    await UpdateLesson.handle({
      id: params.id,
      organization,
      data,
    })

    return response.redirect().back()
  }

  /**
   * Handle tag patch for status, difficulty, or access level
   */
  async tag({ params, request, response, organization }: HttpContext) {
    const data = await request.validateUsing(
      lessonPatchTagValidator,
      withOrganizationMetaData(organization.id)
    )

    await UpdateLessonTag.handle({
      id: params.id,
      organization,
      data,
    })

    return response.redirect().back()
  }

  /**
   * Update order of modules
   */
  async order({ params, request, response, organization }: HttpContext) {
    const data = await request.validateUsing(lessonOrderValidator, {
      meta: {
        organizationId: organization.id,
        courseId: params.courseId,
      },
    })

    await UpdateLessonOrder.handle({
      courseId: params.courseId,
      organization,
      data,
    })

    return response.redirect().back()
  }

  /**
   * Delete record
   */
  async destroy({ params, response, organization }: HttpContext) {
    await DestroyLesson.handle({
      moduleId: params.moduleId,
      id: params.id,
      organization,
    })

    return response.redirect().back()
  }
}
