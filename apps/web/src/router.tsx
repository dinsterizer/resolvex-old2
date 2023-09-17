import { createBrowserRouter } from 'react-router-dom'
import { RootPage } from './pages/_root'
import { CustomerDetailPage } from './pages/customer-detail'
import { CustomerListPage } from './pages/customer-list'
import { WorkspaceDetailPage } from './pages/workspace-detail'
import { WorkspaceListPage } from './pages/workspace-list'
import { WorkspaceOverviewPage } from './pages/workspace-overview'

// const routeTree = rootRoute.addChildren([
//   workspaceListRoute,
//   workspaceDetailRoute.addChildren([customerListRoute.addChildren([customerDetailRoute]), workspaceOverviewRoute]),
// ])

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
