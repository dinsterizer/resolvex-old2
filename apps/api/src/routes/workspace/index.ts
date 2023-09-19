import { router } from '../../trpc'
import { workspaceCreateRouter } from './create'
import { workspaceDetailRouter } from './detail'
import { workspaceLeaveRouter } from './leave'
import { workspaceListRouter } from './list'
import { workspaceOverviewRouter } from './overview'

export const workspaceRouter = router({
  list: workspaceListRouter,
  create: workspaceCreateRouter,
  overview: workspaceOverviewRouter,
  detail: workspaceDetailRouter,
  leave: workspaceLeaveRouter,
})
