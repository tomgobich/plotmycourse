import AuthorizeToken from '#actions/abilities/authorize_token'
import DestroyCourse from '#actions/courses/destroy_course'
import GetCourse from '#actions/courses/get_course'
import GetPaginatedCourses from '#actions/courses/get_paginated_courses'
import StoreCourse from '#actions/courses/store_course'
import UpdateCourse from '#actions/courses/update_course'
import UpdateCourseTag from '#actions/courses/update_course_tag'
import TokenActions from '#enums/token_actions'
import {
  coursePatchTagValidator,
  coursesFilterValidator,
  courseShowFilterValidator,
  courseValidator,
} from '#validators/course'
import { withOrganizationMetaData } from '#validators/helpers/organization'
import type { HttpContext } from '@adonisjs/core/http'

export default class CoursesController {
  /**
   * Display a list of resource
   */
  async index({ request, organization }: HttpContext) {
    AuthorizeToken.action({ organization, action: TokenActions.READ })

    const filters = await request.validateUsing(coursesFilterValidator)

    return GetPaginatedCourses.handle({
      organization,
      filters,
      page: filters.page,
      perPage: filters.perPage,
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, organization }: HttpContext) {
    AuthorizeToken.action({ organization, action: TokenActions.CREATE })

    const data = await request.validateUsing(
      courseValidator,
      withOrganizationMetaData(organization.id)
    )

    return StoreCourse.handle({ organization, data })
  }

  /**
   * Show individual record
   */
  async show({ params, request, organization }: HttpContext) {
    AuthorizeToken.action({ organization, action: TokenActions.READ })

    const filters = await request.validateUsing(courseShowFilterValidator)

    return GetCourse.handle({
      id: params.id,
      organization,
      filters,
    })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, params, organization }: HttpContext) {
    AuthorizeToken.action({ organization, action: TokenActions.UPDATE })

    const data = await request.validateUsing(
      courseValidator,
      withOrganizationMetaData(organization.id)
    )

    return UpdateCourse.handle({
      id: params.id,
      organization,
      data,
    })
  }

  async tag({ request, params, organization }: HttpContext) {
    AuthorizeToken.action({ organization, action: TokenActions.UPDATE })

    const data = await request.validateUsing(
      coursePatchTagValidator,
      withOrganizationMetaData(organization.id)
    )

    return UpdateCourseTag.handle({
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

    return DestroyCourse.handle({
      id: params.id,
      organization,
    })
  }
}
