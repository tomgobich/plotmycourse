import DestroyModule from '#actions/modules/destroy_module'
import StoreModule from '#actions/modules/store_module'
import UpdateModule from '#actions/modules/update_module'
import UpdateModuleOrder from '#actions/modules/update_module_order'
import UpdateModuleTag from '#actions/modules/update_module_tag'
import { withOrganizationMetaData } from '#validators/helpers/organization'
import { moduleOrderValidator, modulePatchTagValidator, moduleValidator } from '#validators/module'
import type { HttpContext } from '@adonisjs/core/http'

export default class ModulesController {
  /**
   * Handle form submission for the create action
   */
  async store({ params, request, response, organization }: HttpContext) {
    const data = await request.validateUsing(
      moduleValidator,
      withOrganizationMetaData(organization.id)
    )

    await StoreModule.handle({
      courseId: params.courseId,
      organization,
      data,
    })

    return response.redirect().back()
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, organization }: HttpContext) {
    const data = await request.validateUsing(
      moduleValidator,
      withOrganizationMetaData(organization.id)
    )

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
    const data = await request.validateUsing(
      modulePatchTagValidator,
      withOrganizationMetaData(organization.id)
    )

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
  async order({ params, request, response, organization }: HttpContext) {
    const { ids } = await request.validateUsing(moduleOrderValidator)

    await UpdateModuleOrder.handle({
      courseId: params.courseId,
      organization,
      ids,
    })

    return response.redirect().back()
  }

  /**
   * Delete record
   */
  async destroy({ params, response, organization }: HttpContext) {
    await DestroyModule.handle({
      courseId: params.courseId,
      id: params.id,
      organization,
    })

    return response.redirect().back()
  }
}
