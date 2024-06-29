import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const AccessLevelsController = () => import('#controllers/access_levels_controller')
const CoursesController = () => import('#controllers/courses_controller')
const DifficultiesController = () => import('#controllers/difficulties_controller')
const OrganizationsController = () => import('#controllers/organizations_controller')
const StatusesController = () => import('#controllers/statuses_controller')

router
  .group(() => {
    router.on('/').renderInertia('home', { version: 6 }).as('home').use(middleware.auth())

    router
      .group(() => {
        router.get('/:id', [OrganizationsController, 'active']).as('active')
      })
      .prefix('organizations')
      .as('organizations')

    router
      .group(() => {
        router.get('/', [DifficultiesController, 'index']).as('index')
        router.post('/', [DifficultiesController, 'store']).as('store')
        router.put('/order', [DifficultiesController, 'order']).as('order')
        router.put('/:id', [DifficultiesController, 'update']).as('update')
        router.delete('/:id', [DifficultiesController, 'destroy']).as('destroy')
      })
      .prefix('/difficulties')
      .as('difficulties')

    router
      .group(() => {
        router.get('/', [StatusesController, 'index']).as('index')
        router.post('/', [StatusesController, 'store']).as('store')
        router.put('/order', [StatusesController, 'order']).as('order')
        router.put('/:id', [StatusesController, 'update']).as('update')
        router.delete('/:id', [StatusesController, 'destroy']).as('destroy')
      })
      .prefix('/statuses')
      .as('statuses')

    router
      .group(() => {
        router.get('/', [AccessLevelsController, 'index']).as('index')
        router.post('/', [AccessLevelsController, 'store']).as('store')
        router.put('/order', [AccessLevelsController, 'order']).as('order')
        router.put('/:id', [AccessLevelsController, 'update']).as('update')
        router.delete('/:id', [AccessLevelsController, 'destroy']).as('destroy')
      })
      .prefix('/access-levels')
      .as('access-levels')

    router
      .group(() => {
        router.get('/', [CoursesController, 'index']).as('index')
        router.get('/:id', [CoursesController, 'show']).as('show')
        router.post('/', [CoursesController, 'store']).as('store')
        router.put('/:id', [CoursesController, 'update']).as('update')
        router.delete('/:id', [CoursesController, 'destroy']).as('destroy')
      })
      .prefix('/courses')
      .as('courses')
  })
  .use([middleware.auth(), middleware.organization()])
