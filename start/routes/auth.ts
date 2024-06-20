import LoginController from '#controllers/auth/login_controller'
import LogoutController from '#controllers/auth/logout_controller'
import RegisterController from '#controllers/auth/register_controller'
import router from '@adonisjs/core/services/router'

router.get('/login', [LoginController, 'show']).as('login.show')
router.post('/login', [LoginController, 'store']).as('login.store')
router.get('/register', [RegisterController, 'show']).as('register.show')
router.post('/register', [RegisterController, 'store']).as('register.store')
router.post('/logout', [LogoutController, 'handle']).as('logout')
