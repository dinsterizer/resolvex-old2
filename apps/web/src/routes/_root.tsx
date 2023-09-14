import { Outlet, RootRoute } from '@tanstack/react-router'
import { useAuthStore } from '~/stores/auth'
import { Login } from './login'

export const rootRoute = new RootRoute({
  component: function Root() {
    const { user } = useAuthStore()

    if (!user) return <Login />

    return (
      <>
        <Outlet />
      </>
    )
  },
})
