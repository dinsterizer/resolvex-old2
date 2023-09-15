import { Router } from '@tanstack/react-router'
import { rootRoute } from './routes/_root'
import { workspaceDetailRoute } from './routes/workspace-detail'
import { workspaceListRoute } from './routes/workspace-list'

const routeTree = rootRoute.addChildren([workspaceListRoute, workspaceDetailRoute])

export const router = new Router({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router
  }
}
