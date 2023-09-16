import { router } from '../../trpc'
import { workspaceCreateRouter } from './create'
import { workspaceListRouter } from './list'

export const workspaceRouter = router({
  list: workspaceListRouter,
  create: workspaceCreateRouter,
})
