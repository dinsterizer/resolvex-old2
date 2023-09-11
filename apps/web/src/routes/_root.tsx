import { Outlet, RootRoute } from '@tanstack/react-router'
import { useAuthStore } from '~/stores/auth'

export const rootRoute = new RootRoute({
  component: function Root() {
    const { userId } = useAuthStore()

    if (!userId)
      return <Login />

    return <>
      <Outlet />
    </>
  },
})

function Login() {
  return <div className="bg-red-100 text-red-900">login</div>
}
