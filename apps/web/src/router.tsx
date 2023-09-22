import { createBrowserRouter } from 'react-router-dom'
import { RootPage } from './pages/_root'
import { CustomerDetailPage } from './pages/customer-detail'
import { CustomerListPage } from './pages/customer-list'
import { WorkspaceDetailPage } from './pages/workspace-detail'
import { WorkspaceListPage } from './pages/workspace-list'
import { WorkspaceOverviewPage } from './pages/workspace-overview'
import { WorkspaceSettingsPage } from './pages/workspace-settings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        index: true,
        element: <WorkspaceListPage />,
      },
      {
        path: ':workspaceId',
        element: <WorkspaceDetailPage />,
        children: [
          {
            index: true,
            element: <WorkspaceOverviewPage />,
          },
          {
            path: 'settings',
            element: <WorkspaceSettingsPage />,
          },
          {
            path: 'customers',
            element: <CustomerListPage />,
            children: [
              {
                path: ':customerId',
                element: <CustomerDetailPage />,
              },
            ],
          },
        ],
      },
    ],
  },
])
