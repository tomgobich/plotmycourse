import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const LessonsController = () => import('#controllers/lessons_controller')
const ModulesController = () => import('#controllers/modules_controller')
const AccessLevelsController = () => import('#controllers/access_levels_controller')
const CoursesController = () => import('#controllers/courses_controller')
const DifficultiesController = () => import('#controllers/difficulties_controller')
const OrganizationsController = () => import('#controllers/organizations_controller')
const StatusesController = () => import('#controllers/statuses_controller')
const SettingsAccountsController = () => import('#controllers/settings/accounts_controller')
const SettingsProfilesController = () => import('#controllers/settings/profiles_controller')
const SettingsOrganizationsController = () =>
  import('#controllers/settings/organizations_controller')

router.on('/').render('landing').as('landing')

router
  .group(() => {
    // we want this out here so we don't enforce an organization to exist
    // and so we can redirect here when a user has no organizations
    router
      .group(() => {
        router.get('/create', [OrganizationsController, 'create']).as('create')
        router.post('/', [OrganizationsController, 'store']).as('store')
        router.put('/:id', [OrganizationsController, 'update']).as('update')
        router.get('/:id', [OrganizationsController, 'active']).as('active')
        router.delete('/:id', [OrganizationsController, 'destroy']).as('destroy')
      })
      .prefix('organizations')
      .as('organizations')
  })
  .use(middleware.auth())

router
  .group(() => {
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
        router.patch('/:id/tags', [CoursesController, 'tag']).as('tags')
        router.delete('/:id', [CoursesController, 'destroy']).as('destroy')

        router.patch('/:courseId/lessons/order', [LessonsController, 'order']).as('lessons.order')
      })
      .prefix('/courses')
      .as('courses')

    router
      .group(() => {
        router.post('/', [ModulesController, 'store']).as('store')
        router.put('/:id', [ModulesController, 'update']).as('update')
        router.patch('/order', [ModulesController, 'order']).as('order')
        router.patch('/:id/tags', [ModulesController, 'tag']).as('tags')
        router.delete('/:id', [ModulesController, 'destroy']).as('destroy')
      })
      .prefix('/courses/:courseId/modules')
      .as('modules')

    router
      .group(() => {
        router.get('/', [LessonsController, 'index']).as('index')
        router.get('/:id', [LessonsController, 'show']).as('show')
      })
      .prefix('/lessons')
      .as('lessons')

    router
      .group(() => {
        router.post('/', [LessonsController, 'store']).as('store')
        router.put('/:id', [LessonsController, 'update']).as('update')
        router.patch('/:id/tags', [LessonsController, 'tag']).as('tags')
        router.patch('/:id/notes', [LessonsController, 'notes']).as('notes')
        router.delete('/:id', [LessonsController, 'destroy']).as('destroy')
      })
      .prefix('/courses/:courseId/modules/:moduleId/lessons')
      .as('lessons')

    router
      .group(() => {
        router.get('/', [SettingsAccountsController, 'index']).as('index')
        router.put('/email', [SettingsAccountsController, 'updateEmail']).as('email')
        router.delete('/', [SettingsAccountsController, 'destroy']).as('destroy')
      })
      .prefix('/settings/account')
      .as('settings.account')

    router
      .group(() => {
        router.get('/', [SettingsProfilesController, 'index']).as('index')
        router.put('/', [SettingsProfilesController, 'update']).as('update')
      })
      .prefix('/settings/profile')
      .as('settings.profile')

    router
      .group(() => {
        router.get('/', [SettingsOrganizationsController, 'index']).as('index')
        router.post('/invite', [SettingsOrganizationsController, 'inviteUser']).as('invite')
        router
          .delete('/invite/:id', [SettingsOrganizationsController, 'cancelInvite'])
          .as('invite.cancel')
        router
          .delete('/user/:id', [SettingsOrganizationsController, 'removeUser'])
          .as('user.remove')

        router
          .post('/access-tokens', [SettingsOrganizationsController, 'storeAccessToken'])
          .as('accessTokens.store')
      })
      .prefix('/settings/organization')
      .as('settings.organization')
  })
  .use([middleware.auth(), middleware.organization()])
