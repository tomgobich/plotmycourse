const LessonsController = () => import('#controllers/api/lessons_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
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

})
  .prefix('/api/v1')
  .use([
    middleware.forceJsonResponse(),
    middleware.auth({ guards: ['api'] }), 
    middleware.organization()
  ])
