import { Route } from '@tanstack/react-router'
import { TODOAlert } from '~/components/todo-alert'
import { workspaceDetailRoute } from './workspace-detail'

export const workspaceOverviewRoute = new Route({
  getParentRoute: () => workspaceDetailRoute,
  path: '/',
  component: function CustomerListPage() {
    return (
      <div className="flex-1">
        <TODOAlert className="w-full" />
      </div>
    )
  },
})
