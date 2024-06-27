import CourseDto from '#dtos/course'
import type { HttpContext } from '@adonisjs/core/http'

export default class CoursesController {
  /**
   * Display a list of resource
   */
  async index({ inertia, organization }: HttpContext) {
    const courses = await organization
      .related('courses')
      .query()
      .preload('status')
      .preload('difficulty')
      .preload('accessLevel')
      .withCount('lessons')
      .withCount('modules')
      .orderBy('order')

    return inertia.render('courses/index', {
      courses: CourseDto.fromArray(courses)
    })
  }

  /**
   * Display form to create a new record
   */
  async create({ }: HttpContext) { }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) { }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) { }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) { }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) { }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) { }
}
