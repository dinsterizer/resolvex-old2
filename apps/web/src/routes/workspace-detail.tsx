import { Outlet, Route } from '@tanstack/react-router'
import { Sidebar } from '~/components/sidebar'
import { rootRoute } from './_root'

export const workspaceDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '$workspaceId',
  component: function WorkspaceDetailPage({ useParams }) {
    const params = useParams()
    return (
      <div className="p-4 flex gap-8 h-screen">
        <Sidebar workspaceId={params.workspaceId} />

        <div className="flex-1 h-full">
          <Outlet />
        </div>
      </div>
    )
  },
})
