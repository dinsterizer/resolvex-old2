import { router } from '../../trpc'
import { workspaceListRouter } from './list'

export const workspaceRouter = router({
  list: workspaceListRouter,
})
