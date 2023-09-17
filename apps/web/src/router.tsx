import { createBrowserRouter } from 'react-router-dom'
import { RootPage } from './routes/_root'
import { CustomerDetailPage } from './routes/customer-detail'
import { CustomerListPage } from './routes/customer-list'
import { WorkspaceDetailPage } from './routes/workspace-detail'
import { WorkspaceListPage } from './routes/workspace-list'
import { WorkspaceOverviewPage } from './routes/workspace-overview'

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
