import { useParams, Outlet } from 'react-router-dom'
import { Sidebar } from '~/components/sidebar'

export function WorkspaceDetailPage() {
  const params = useParams() as { workspaceId: string }
  return (
    <div className="p-4 flex gap-8 h-screen">
      <Sidebar workspaceId={params.workspaceId} />

      <div className="flex-1 h-full">
        <Outlet />
      </div>
    </div>
  )
}
