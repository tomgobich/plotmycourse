import CreateStatus from '#actions/statuses/create_status'
import DestroyStatus from '#actions/statuses/destroy_status'
import UpdateStatus from '#actions/statuses/update_status'
import UpdateStatusOrder from '#actions/statuses/update_status_order'
import StatusDto from '#dtos/status'
import { statusOrderValidator, statusValidator } from '#validators/status'
import type { HttpContext } from '@adonisjs/core/http'

export default class StatusesController {
  /**
   * Display a list of resource
   */
  async index({ inertia, organization }: HttpContext) {
    const statuses = await organization.getStatuses()
    return inertia.render('statuses/index', {
      statuses: StatusDto.fromArray(statuses),
    })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, organization }: HttpContext) {
    const data = await request.validateUsing(statusValidator)

    await CreateStatus.handle({
      organization,
      data,
    })

    return response.redirect().back()
  }

  /**
   * Edit individual record
   */
  async order({ request, response, organization }: HttpContext) {
    const { ids } = await request.validateUsing(statusOrderValidator)

    await UpdateStatusOrder.handle({
      organization,
      ids,
    })

    return response.redirect().back()
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, organization }: HttpContext) {
    const data = await request.validateUsing(statusValidator)

    await UpdateStatus.handle({
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
    await DestroyStatus.handle({
      id: params.id,
      organization,
    })

    return response.redirect().back()
  }
}
