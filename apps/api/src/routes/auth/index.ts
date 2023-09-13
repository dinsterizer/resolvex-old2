import { router } from '../../trpc'
import { loginEmailRouter } from './login.email'

export const authRouter = router({
  login: router({
    email: loginEmailRouter,
  }),
})
