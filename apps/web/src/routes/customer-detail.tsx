import { Route } from '@tanstack/react-router'
import { TODOAlert } from '~/components/todo-alert'
import { customerListRoute } from './customer-list'

export const customerDetailRoute = new Route({
  getParentRoute: () => customerListRoute,
  path: '$customerId',
  component: function CustomerDetailPage() {
    return (
      <div>
        <TODOAlert />
      </div>
    )
  },
})
