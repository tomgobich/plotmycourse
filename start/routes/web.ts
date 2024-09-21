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

// ignore formatting, easier to visually scan single-line routes
/* prettier-ignore-start */
/* eslint-disable */

router.on('/').render('landing').as('landing')

router.group(() => {

  //* ORGANIZATION
  // we want this out here so we don't enforce an organization to exist
  // and so we can redirect here when a user has no organizations
  router.get('/organizations/create', [OrganizationsController, 'create']).as('organizations.create')
  router.post('/organizations', [OrganizationsController, 'store']).as('organizations.store')
  router.put('/organizations/:id', [OrganizationsController, 'update']).as('organizations.update')
  router.get('/organizations/:id', [OrganizationsController, 'active']).as('organizations.active')
  router.delete('/organizations/:id', [OrganizationsController, 'destroy']).as('organizations.destroy')

}).use(middleware.auth())

router.group(() => {

  //* DIFFICULTIES
  router.get('/difficulties', [DifficultiesController, 'index']).as('difficulties.index')
  router.post('/difficulties', [DifficultiesController, 'store']).as('difficulties.store')
  router.put('/difficulties/order', [DifficultiesController, 'order']).as('difficulties.order')
  router.put('/difficulties/:id', [DifficultiesController, 'update']).as('difficulties.update')
  router.delete('/difficulties/:id', [DifficultiesController, 'destroy']).as('difficulties.destroy')

  //* STATUSES
  router.get('/statuses', [StatusesController, 'index']).as('statuses.index')
  router.post('/statuses', [StatusesController, 'store']).as('statuses.store')
  router.put('/statuses/order', [StatusesController, 'order']).as('statuses.order')
  router.put('/statuses/:id', [StatusesController, 'update']).as('statuses.update')
  router.delete('/statuses/:id', [StatusesController, 'destroy']).as('statuses.destroy')

  //* ACCESS LEVELS
  router.get('/access-levels', [AccessLevelsController, 'index']).as('access-levels.index')
  router.post('/access-levels', [AccessLevelsController, 'store']).as('access-levels.store')
  router.put('/access-levels/order', [AccessLevelsController, 'order']).as('access-levels.order')
  router.put('/access-levels/:id', [AccessLevelsController, 'update']).as('access-levels.update')
  router.delete('/access-levels/:id', [AccessLevelsController, 'destroy']).as('access-levels.destroy')

  //* COURSES
  router.get('/courses', [CoursesController, 'index']).as('courses.index')
  router.get('/courses/:id', [CoursesController, 'show']).as('courses.show')
  router.post('/courses', [CoursesController, 'store']).as('courses.store')
  router.put('/courses/:id', [CoursesController, 'update']).as('courses.update')
  router.patch('/courses/:id/tags', [CoursesController, 'tag']).as('courses.tags')
  router.delete('/courses/:id', [CoursesController, 'destroy']).as('courses.destroy')

  //* MODULES
  router.post('/courses/:courseId/modules', [ModulesController, 'store']).as('modules.store')
  router.put('/courses/:courseId/modules/:id', [ModulesController, 'update']).as('modules.update')
  router.patch('/courses/:courseId/modules/order', [ModulesController, 'order']).as('modules.order')
  router.patch('/courses/:courseId/modules/:id/tags', [ModulesController, 'tag']).as('modules.tags')
  router.delete('/courses/:courseId/modules/:id', [ModulesController, 'destroy']).as('modules.destroy')

  //* LESSONS
  router.get('/lessons', [LessonsController, 'index']).as('lessons.index')
  router.get('/lessons/:id', [LessonsController, 'show']).as('lessons.show')
  router.patch('/courses/:courseId/lessons/order', [LessonsController, 'order']).as('courses.lessons.order')
  router.post('/courses/:courseId/modules/:moduleId/lessons', [LessonsController, 'store']).as('lessons.store')
  router.put('/courses/:courseId/modules/:moduleId/lessons/:id', [LessonsController, 'update']).as('lessons.update')
  router.patch('/courses/:courseId/modules/:moduleId/lessons/:id/tags', [LessonsController, 'tag']).as('lessons.tags')
  router.patch('/courses/:courseId/modules/:moduleId/lessons/:id/notes', [LessonsController, 'notes']).as('lessons.notes')
  router.delete('/courses/:courseId/modules/:moduleId/lessons/:id', [LessonsController, 'destroy']).as('lessons.destroy')

  //* SETTINGS.ACCOUNT
  router.get('/settings/account', [SettingsAccountsController, 'index']).as('settings.account.index')
  router.put('/settings/account/email', [SettingsAccountsController, 'updateEmail']).as('settings.account.email')
  router.delete('/settings/account', [SettingsAccountsController, 'destroy']).as('settings.account.destroy')

  //* SETTINGS.PROFILE
  router.get('/settings/profile', [SettingsProfilesController, 'index']).as('settings.profile.index')
  router.put('/settings/profile', [SettingsProfilesController, 'update']).as('settings.profile.update')

  //* SETTINGS.ORGANIZATIOn
  router.get('/settings/organization/', [SettingsOrganizationsController, 'index']).as('settings.organization.index')
  router.post('/settings/organization/invite', [SettingsOrganizationsController, 'inviteUser']).as('settings.organization.invite')
  router.delete('/settings/organization/invite/:id', [SettingsOrganizationsController, 'cancelInvite']).as('settings.organization.invite.cancel')
  router.delete('/settings/organization/user/:id', [SettingsOrganizationsController, 'removeUser']).as('settings.organization.user.remove')
  // router.post('/settings/organization/access-tokens', [SettingsOrganizationsController, 'storeAccessToken']).as('settings.organization.accessTokens.store')
  // router.delete('/settings/organization/access-tokens/:id', [SettingsOrganizationsController, 'destroyAccessToken']).as('settings.organization.accessTokens.destroy')

}).use([middleware.auth({ guards: ['web'] }), middleware.organization()])
