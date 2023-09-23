import { useParams, Outlet, useMatch } from 'react-router-dom'
import { HorizontalSidebar, VerticalSidebar } from '~/components/sidebar'

export function WorkspaceDetailPage() {
  const params = useParams() as { workspaceId: string }
  const matchCustomerDetail = useMatch(`/${params.workspaceId}/customers/:customerId`)

  return (
    <div className="lg:flex flex-row lg:h-screen">
      <div className="p-4 lg:hidden">
        <HorizontalSidebar workspaceId={params.workspaceId} />
      </div>

      <div className="p-4 hidden lg:block max-w-xs">
        <VerticalSidebar collapse={matchCustomerDetail !== null} workspaceId={params.workspaceId} />
      </div>

      {/* TODO: care about on mobile it enough heigh or not? */}
      <div className="flex-1 lg:overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
