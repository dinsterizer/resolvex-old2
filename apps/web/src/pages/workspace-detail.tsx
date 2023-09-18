import { useParams, Outlet } from 'react-router-dom'
import { HorizontalSidebar, VerticalSidebar } from '~/components/sidebar'

export function WorkspaceDetailPage() {
  const params = useParams() as { workspaceId: string }
  return (
    <div className="lg:flex flex-row h-screen">
      <div className="p-4 lg:hidden">
        <HorizontalSidebar workspaceId={params.workspaceId} />
      </div>

      <div className="p-4 hidden lg:block w-44">
        <VerticalSidebar workspaceId={params.workspaceId} />
      </div>

      <div className="flex-1 lg:overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
