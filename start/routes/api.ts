const StatusesController = () => import('#controllers/api/statuses_controller')

const DifficultiesController = () => import('#controllers/api/difficulties_controller')

const AccessLevelsController = () => import('#controllers/api/access_levels_controller')

const LessonsController = () => import('#controllers/api/lessons_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const LessonTypesController = () => import('#controllers/api/lesson_types_controller')
const CoursesController = () => import('#controllers/api/courses_controller')

// ignore formatting, easier to visually scan single-line routes
/* prettier-ignore-start */
/* eslint-disable */

router.group(() => {

  router.get('/courses', [CoursesController, 'index'])
  router.post('/courses/search', [CoursesController, 'index'])
  router.post('/courses/:id', [CoursesController, 'show'])
  router.post('/courses', [CoursesController, 'store'])
  router.put('/courses/:id', [CoursesController, 'update'])
  router.patch('/courses/:id/tags', [CoursesController, 'tag'])
  router.delete('/courses/:id', [CoursesController, 'destroy'])

  router.get('/lessons', [LessonsController, 'index'])
  router.post('/lessons/search', [LessonsController, 'index'])
  router.get('/lessons/:id', [LessonsController, 'show'])
  router.post('/lessons', [LessonsController, 'store'])
  router.put('/lessons/:id', [LessonsController, 'update'])
  router.delete('/lessons/:id', [LessonsController, 'destroy'])

  router.get('/access-levels', [AccessLevelsController, 'index'])

  router.get('/difficulties', [DifficultiesController, 'index'])

  router.get('/lesson-types', [LessonTypesController, 'index'])

  router.get('/statuses', [StatusesController, 'index'])

})
  .prefix('/api/v1')
  .use([
    middleware.forceJsonResponse(),
    middleware.auth({ guards: ['api'] }),
    middleware.organization()
  ])
