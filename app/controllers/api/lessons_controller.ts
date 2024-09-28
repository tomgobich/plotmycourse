import GetPaginatedLessons from '#actions/lessons/get_paginated_lessons'
import UnauthorizedException from '#exceptions/unauthorized_exception'
import { lessonsFilterValidator } from '#validators/lesson'
import type { HttpContext } from '@adonisjs/core/http'

export default class LessonsController {
  /**
   * Display a list of resource
   */
  async index({ request, organization }: HttpContext) {
    if (!organization.currentAccessToken?.allows('read')) {
      throw new UnauthorizedException('You do not have permission to read from this organization')
    }

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
