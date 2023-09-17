import { router } from '../../trpc'
import { customerListRouter } from './list'

export const customerRouter = router({
  list: customerListRouter,
})
