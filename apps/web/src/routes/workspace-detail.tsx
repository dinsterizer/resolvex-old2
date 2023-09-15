import { Route } from '@tanstack/react-router'
import { rootRoute } from './_root'

export const workspaceDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '$workspaceId',
  component: function WorkspaceDetailPage() {
    return <div>TODO: workspace detail page</div>
  },
})
