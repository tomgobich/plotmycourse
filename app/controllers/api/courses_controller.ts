import GetCourses from '#actions/courses/get_courses'
import CourseDto from '#dtos/course'
import UnauthorizedException from '#exceptions/unauthorized_exception'
import type { HttpContext } from '@adonisjs/core/http'

export default class CoursesController {
  /**
   * Display a list of resource
   */
  async index({ organization }: HttpContext) {
    if (!organization.currentAccessToken?.allows('read')) {
      throw new UnauthorizedException('You do not have permission to read from this organization')
    }

    const courses = await GetCourses.handle({ organization })

    return CourseDto.fromArray(courses)
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
