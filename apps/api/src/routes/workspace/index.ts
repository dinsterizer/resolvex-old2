import { router } from '../../trpc'
import { workspaceCreateRouter } from './create'
import { workspaceListRouter } from './list'
import { workspaceOverviewRouter } from './overview'

export const workspaceRouter = router({
  list: workspaceListRouter,
  create: workspaceCreateRouter,
  overview: workspaceOverviewRouter,
})
