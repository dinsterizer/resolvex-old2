import { Router } from '@tanstack/react-router'
import { rootRoute } from './routes/_root'
import { customerDetailRoute } from './routes/customer-detail'
import { customerListRoute } from './routes/customer-list'
import { workspaceDetailRoute } from './routes/workspace-detail'
import { workspaceListRoute } from './routes/workspace-list'
import { workspaceOverviewRoute } from './routes/workspace-overview'

const routeTree = rootRoute.addChildren([
  workspaceListRoute,
  workspaceDetailRoute.addChildren([customerListRoute.addChildren([customerDetailRoute]), workspaceOverviewRoute]),
])

export const router = new Router({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router
  }
}
