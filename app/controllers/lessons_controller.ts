import DestroyLesson from '#actions/lessons/destroy_lesson'
import GetLesson from '#actions/lessons/get_lesson'
import GetPaginatedLessons from '#actions/lessons/get_paginated_lessons'
import StoreLesson from '#actions/lessons/store_lesson'
import UpdateLesson from '#actions/lessons/update_lesson'
import UpdateLessonNotes from '#actions/lessons/update_lesson_notes'
import UpdateLessonOrder from '#actions/lessons/update_lesson_order'
import UpdateLessonTag from '#actions/lessons/update_lesson_tag'
import LessonDto from '#dtos/lesson'
import { withOrganizationMetaData } from '#validators/helpers/organization'
import {
  lessonNotesValidator,
  lessonOrderValidator,
  lessonPatchTagValidator,
  lessonValidator,
} from '#validators/lesson'
import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

export default class LessonsController {
  async index({ request, inertia, organization }: HttpContext) {
    const page = request.input('page', 1)
    const paginator = await GetPaginatedLessons.handle({ organization, page })

    paginator.baseUrl(router.makeUrl('lessons.index'))
    paginator.queryString(request.qs())

    return inertia.render('lessons/index', {
      lessons: LessonDto.fromPaginator(paginator),
    })
  }

  async show({ params, inertia, organization }: HttpContext) {
    return inertia.render('lessons/show', {
      lesson: await GetLesson.handle({ organization, id: params.id }),
    })
  }
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

  async notes({ params, request, response, session, organization }: HttpContext) {
    const data = await request.validateUsing(lessonNotesValidator)

    await UpdateLessonNotes.handle({
      id: params.id,
      organization,
      data,
    })

    session.flash('success', 'Lesson notes have been updated')

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
