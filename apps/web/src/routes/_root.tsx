import { Outlet, RootRoute } from '@tanstack/react-router'
import { Login } from '~/components/login'
import { useAuthStore } from '~/stores/auth'

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
