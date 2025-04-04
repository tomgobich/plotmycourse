import DestroyCourse from '#actions/courses/destroy_course'
import GetCourse from '#actions/courses/get_course'
import GetCourses from '#actions/courses/get_courses'
import StoreCourse from '#actions/courses/store_course'
import UpdateCourse from '#actions/courses/update_course'
import UpdateCourseOrder from '#actions/courses/update_course_order'
import UpdateCourseTag from '#actions/courses/update_course_tag'
import CourseDto from '#dtos/course'
import ModuleDto from '#dtos/module'
import { courseOrderValidator, coursePatchTagValidator, courseValidator } from '#validators/course'
import { withOrganizationMetaData } from '#validators/helpers/organization'
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
   * Handle form submission for the create action
   */
  async store({ request, response, organization }: HttpContext) {
    const data = await request.validateUsing(
      courseValidator,
      withOrganizationMetaData(organization.id)
    )

    const course = await StoreCourse.handle({
      organization,
      data,
    })

    return response.redirect().toRoute('courses.show', { id: course.id })
  }

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
      modules: modules && ModuleDto.fromArray(modules),
    })
  }

  /**
   * Handle reordering of difficulties
   */
  async order({ request, response, organization }: HttpContext) {
    const { ids } = await request.validateUsing(courseOrderValidator)

    await UpdateCourseOrder.handle({
      organization,
      ids,
    })

    return response.redirect().back()
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, organization }: HttpContext) {
    const data = await request.validateUsing(
      courseValidator,
      withOrganizationMetaData(organization.id)
    )

    await UpdateCourse.handle({
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
      coursePatchTagValidator,
      withOrganizationMetaData(organization.id)
    )

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
  async destroy({ params, response, organization }: HttpContext) {
    await DestroyCourse.handle({
      id: params.id,
      organization,
    })

    return response.redirect().toRoute('courses.index')
  }
}
