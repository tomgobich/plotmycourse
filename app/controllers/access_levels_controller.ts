import StoreAccessLevel from '#actions/access_levels/store_access_level'
import DestroyAccessLevel from '#actions/access_levels/destroy_access_level'
import UpdateAccessLevel from '#actions/access_levels/update_access_level'
import UpdateAccessLevelOrder from '#actions/access_levels/update_access_level_order'
import {
  accessLevelDestroyValidator,
  accessLevelOrderValidate,
  accessLevelValidator,
} from '#validators/access_level'
import type { HttpContext } from '@adonisjs/core/http'
import AccessLevelDto from '#dtos/access_level'
import { withOrganizationMetaData } from '#validators/helpers/organization'

export default class AccessLevelsController {
  /**
   * Display a list of resource
   */
  async index({ inertia, organization }: HttpContext) {
    const accessLevels = await organization
      .getAccessLevels()
      .withCount('courses')
      .withCount('lessons')

    return inertia.render('access_levels/index', {
      accessLevels: AccessLevelDto.fromArray(accessLevels),
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, organization }: HttpContext) {
    const data = await request.validateUsing(accessLevelValidator)

    await StoreAccessLevel.handle({
      organization,
      data,
    })

    return response.redirect().back()
  }

  /**
   * Update order of the access levels
   */
  async order({ request, response, organization }: HttpContext) {
    const { ids } = await request.validateUsing(accessLevelOrderValidate)

    await UpdateAccessLevelOrder.handle({
      organization,
      ids,
    })

    return response.redirect().back()
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, organization }: HttpContext) {
    const data = await request.validateUsing(accessLevelValidator)

    await UpdateAccessLevel.handle({
      id: params.id,
      organization,
      data,
    })

    return response.redirect().back()
  }

  /**
   * Delete record
   */
  async destroy({ params, request, response, organization }: HttpContext) {
    const data = await request.validateUsing(
      accessLevelDestroyValidator,
      withOrganizationMetaData(organization.id)
    )

    await DestroyAccessLevel.handle({
      id: params.id,
      organization,
      data,
    })

    return response.redirect().back()
  }
}
