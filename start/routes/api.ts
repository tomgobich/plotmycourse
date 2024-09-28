const LessonsController = () => import('#controllers/api/lessons_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const CoursesController = () => import('#controllers/api/courses_controller')

// ignore formatting, easier to visually scan single-line routes
/* prettier-ignore-start */
/* eslint-disable */

router.group(() => {

  router.post('/courses', [CoursesController, 'index'])
  router.post('/courses/:id', [CoursesController, 'show'])
  router.post('/lessons', [LessonsController, 'index'])

})
  .prefix('/api/v1')
  .use([middleware.auth({ guards: ['api'] }), middleware.organization()])
