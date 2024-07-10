import router from '@adonisjs/core/services/router'
const LoginController = () => import('#controllers/auth/login_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')
const RegisterController = () => import('#controllers/auth/register_controller')

router.get('/login', [LoginController, 'show']).as('login.show')
router.post('/login', [LoginController, 'store']).as('login.store')
router.get('/register', [RegisterController, 'show']).as('register.show')
router.post('/register', [RegisterController, 'store']).as('register.store')
router.post('/logout', [LogoutController, 'handle']).as('logout')
