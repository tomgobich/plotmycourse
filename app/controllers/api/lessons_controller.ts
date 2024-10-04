import AuthorizeToken from '#actions/abilities/authorize_token'
import DestroyLesson from '#actions/lessons/destroy_lesson'
import GetLesson from '#actions/lessons/get_lesson'
import GetPaginatedLessons from '#actions/lessons/get_paginated_lessons'
import StoreLesson from '#actions/lessons/store_lesson'
import UpdateLesson from '#actions/lessons/update_lesson'
import UpdateLessonTag from '#actions/lessons/update_lesson_tag'
import TokenActions from '#enums/token_actions'
import { withOrganizationMetaData } from '#validators/helpers/organization'
import {
  lessonPatchTagValidator,
  lessonsFilterValidator,
  lessonValidator,
} from '#validators/lesson'
import type { HttpContext } from '@adonisjs/core/http'

export default class LessonsController {
  /**
   * Display a list of resource
   */
  async index({ request, organization }: HttpContext) {
    AuthorizeToken.action({ organization, action: TokenActions.READ })

    const filters = await request.validateUsing(lessonsFilterValidator)

    return GetPaginatedLessons.handle({
      organization,
      filters,
      page: filters?.page,
      perPage: filters?.perPage,
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, organization }: HttpContext) {
    AuthorizeToken.action({ organization, action: TokenActions.CREATE })

    const data = await request.validateUsing(
      lessonValidator,
      withOrganizationMetaData(organization.id)
    )

    return StoreLesson.handle({
      organization,
      data,
    })
  }

  /**
   * Show individual record
   */
  async show({ params, organization }: HttpContext) {
    AuthorizeToken.action({ organization, action: TokenActions.READ })

    return GetLesson.handle({
      organization,
      id: params.id,
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, params, organization }: HttpContext) {
    AuthorizeToken.action({ organization, action: TokenActions.UPDATE })

    const data = await request.validateUsing(
      lessonValidator,
      withOrganizationMetaData(organization.id)
    )

    return UpdateLesson.handle({
      id: params.id,
      organization,
      data,
    })
  }

  async tag({ request, params, organization }: HttpContext) {
    AuthorizeToken.action({ organization, action: TokenActions.UPDATE })

    const data = await request.validateUsing(
      lessonPatchTagValidator,
      withOrganizationMetaData(organization.id)
    )

    return UpdateLessonTag.handle({
      id: params.id,
      organization,
      data,
    })
  }

  /**
   * Delete record
   */
  async destroy({ params, organization }: HttpContext) {
    AuthorizeToken.action({ organization, action: TokenActions.DELETE })

    return DestroyLesson.handle({
      id: params.id,
      organization,
    })
  }
}
