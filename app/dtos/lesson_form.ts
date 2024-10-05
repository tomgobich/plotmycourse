import LessonDto from './lesson.js'
import { DateTime } from 'luxon'

export default class LessonFormDto {
  declare moduleId?: number
  declare accessLevelId?: string
  declare statusId?: string
  declare lessonTypeId?: string
  declare name: string
  declare publishAtDate: string | null
  declare publishAtTime: string | null

  constructor(lesson?: LessonDto) {
    if (!lesson) return

    const publishAt = lesson.publishAt ? DateTime.fromISO(lesson.publishAt) : null

    this.moduleId = lesson.moduleId
    this.accessLevelId = lesson.accessLevelId.toString()
    this.statusId = lesson.statusId.toString()
    this.lessonTypeId = lesson.lessonTypeId.toString()
    this.name = lesson.name
    this.publishAtDate = publishAt ? publishAt.toFormat('yyyy-MM-dd') : null
    this.publishAtTime = publishAt ? publishAt.toFormat('HH:mm') : null
  }
}
