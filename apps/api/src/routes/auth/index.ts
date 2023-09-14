import { router } from '../../trpc'
import { loginEmailRouter } from './login.email'
import { loginGoogleRouter } from './login.google'

export const authRouter = router({
  login: router({
    email: loginEmailRouter,
    google: loginGoogleRouter,
  }),
})
