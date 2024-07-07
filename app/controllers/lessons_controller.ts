import DestroyLesson from '#actions/lessons/destroy_lesson'
import StoreLesson from '#actions/lessons/store_lesson'
import UpdateLesson from '#actions/lessons/update_lesson'
import UpdateLessonOrder from '#actions/lessons/update_lesson_order'
import UpdateLessonTag from '#actions/lessons/update_lesson_tag'
import { lessonOrderValidator, lessonPatchTagValidator, lessonValidator } from '#validators/lesson'
import type { HttpContext } from '@adonisjs/core/http'

export default class LessonsController {
  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ params, request, response, organization }: HttpContext) {
    const data = await request.validateUsing(lessonValidator)

    await StoreLesson.handle({
      moduleId: params.moduleId,
      organization,
      data,
    })

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
  async update({ params, request, response, organization }: HttpContext) {
    const data = await request.validateUsing(lessonValidator)

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
    const data = await request.validateUsing(lessonPatchTagValidator)

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
    const data = await request.validateUsing(lessonOrderValidator)

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
