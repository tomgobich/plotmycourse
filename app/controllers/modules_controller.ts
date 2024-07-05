import StoreModule from '#actions/modules/store_module'
import UpdateModule from '#actions/modules/update_module'
import UpdateModuleTag from '#actions/modules/update_module_tag'
import { modulePatchTagValidator, moduleValidator } from '#validators/module'
import type { HttpContext } from '@adonisjs/core/http'

export default class ModulesController {
  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ params, request, response, organization }: HttpContext) {
    const data = await request.validateUsing(moduleValidator)

    await StoreModule.handle({
      courseId: params.courseId,
      organization,
      data,
    })

    return response.redirect().back()
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, organization }: HttpContext) {
    const data = await request.validateUsing(moduleValidator)

    await UpdateModule.handle({
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
    const data = await request.validateUsing(modulePatchTagValidator)

    await UpdateModuleTag.handle({
      id: params.id,
      organization,
      data,
    })

    return response.redirect().back()
  }

  /**
   * Update order of modules
   */
  async order({ request, response, organization }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
