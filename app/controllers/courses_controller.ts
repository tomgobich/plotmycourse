import GetCourse from '#actions/courses/get_course'
import GetCourses from '#actions/courses/get_courses'
import UpdateCourseTag from '#actions/courses/update_course_tag'
import CourseDto from '#dtos/course'
import ModuleDto from '#dtos/module'
import { coursePatchTagValidator } from '#validators/course'
import type { HttpContext } from '@adonisjs/core/http'

export default class CoursesController {
  /**
   * Display a list of resource
   */
  async index({ inertia, organization }: HttpContext) {
    const courses = await GetCourses.handle({ organization })

    return inertia.render('courses/index', {
      courses: CourseDto.fromArray(courses),
    })
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params, inertia, organization }: HttpContext) {
    const { course, modules } = await GetCourse.handle({
      id: params.id,
      organization,
    })

    return inertia.render('courses/show', {
      course: new CourseDto(course),
      modules: ModuleDto.fromArray(modules),
    })
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Handle tag patch for status, difficulty, or access level
   */
  async tag({ params, request, response, organization }: HttpContext) {
    const data = await request.validateUsing(coursePatchTagValidator)

    await UpdateCourseTag.handle({
      id: params.id,
      organization,
      data,
    })

    return response.redirect().back()
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
