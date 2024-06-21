import DifficultiesController from '#controllers/difficulties_controller'
import OrganizationsController from '#controllers/organizations_controller'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

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
      })
      .prefix('/difficulties')
      .as('difficulties')
  })
  .use([middleware.auth(), middleware.organization()])
