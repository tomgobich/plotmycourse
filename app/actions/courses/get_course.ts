import Organization from '#models/organization'

type Params = {
  id: number
  organization: Organization
}

export default class GetCourse {
  static async handle({ organization, id }: Params) {
    const course = await organization.findCourse(id)
    const modules = await course
      .related('modules')
      .query()
      .preload('status')
      .preload('lessons', (lessons) =>
        lessons.preload('accessLevel').preload('status').orderBy('order')
      )
      .orderBy('order')

    await course.load('accessLevel')
    await course.load('difficulty')
    await course.load('status')
    await course.loadCount('lessons')

    return { course, modules }
  }
}
