import GetCourse from '#actions/courses/get_course'
import GetCourses from '#actions/courses/get_courses'
import UnauthorizedException from '#exceptions/unauthorized_exception'
import { coursesFilterValidator, courseShowFilterValidator } from '#validators/course'
import type { HttpContext } from '@adonisjs/core/http'

export default class CoursesController {
  /**
   * Display a list of resource
   */
  async index({ request, organization }: HttpContext) {
    if (!organization.currentAccessToken?.allows('read')) {
      throw new UnauthorizedException('You do not have permission to read from this organization')
    }

    const filters = await request.validateUsing(coursesFilterValidator)
    const courses = await GetCourses.handle({ organization, filters })

    return {
      filters,
      courses,
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params, request, organization }: HttpContext) {
    if (!organization.currentAccessToken?.allows('read')) {
      throw new UnauthorizedException('You do not have permission to read from this organization')
    }

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
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
