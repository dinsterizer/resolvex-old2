import { router } from '../../trpc'
import { customerDetailRouter } from './detail'
import { customerListRouter } from './list'

export const customerRouter = router({
  list: customerListRouter,
  detail: customerDetailRouter,
})
