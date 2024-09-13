import GetCourses from '#actions/courses/get_courses'
import UnauthorizedException from '#exceptions/unauthorized_exception'
import { courseFilterValidator } from '#validators/course'
import type { HttpContext } from '@adonisjs/core/http'

export default class CoursesController {
  /**
   * Display a list of resource
   */
  async index({ request, organization }: HttpContext) {
    if (!organization.currentAccessToken?.allows('read')) {
      throw new UnauthorizedException('You do not have permission to read from this organization')
    }

    const filters = await request.validateUsing(courseFilterValidator)
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
  async show({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
