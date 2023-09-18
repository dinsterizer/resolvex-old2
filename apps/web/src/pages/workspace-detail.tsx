import { useParams, Outlet } from 'react-router-dom'
import { HorizontalSidebar, VerticalSidebar } from '~/components/sidebar'

export function WorkspaceDetailPage() {
  const params = useParams() as { workspaceId: string }
  return (
    <div className="p-4 pb-0 lg:flex flex-row gap-8 h-screen">
      <div className="lg:hidden">
        <HorizontalSidebar workspaceId={params.workspaceId} />
      </div>

      <div className="hidden lg:block w-44">
        <VerticalSidebar workspaceId={params.workspaceId} />
      </div>

      <div className="flex-1 lg:overflow-auto mt-8 lg:mt-0 pb-4">
        <Outlet />
      </div>
    </div>
  )
}
