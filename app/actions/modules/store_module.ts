import Organization from '#models/organization'
import { moduleValidator } from '#validators/module'
import { Infer } from '@vinejs/vine/types'

type Params = {
  organization: Organization
  courseId: number
  data: Infer<typeof moduleValidator>
}

export default class StoreModule {
  static async handle({ organization, courseId, data }: Params) {
    const course = await organization.findCourse(courseId)

    return course.related('modules').create({
      ...data,
      organizationId: organization.id,
      order: await course.findNextSort(),
    })
  }
}
