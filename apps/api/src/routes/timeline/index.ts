import { router } from '../../trpc'
import { timelineListRouter } from './list'

export const timelineRouter = router({
  list: timelineListRouter,
})
