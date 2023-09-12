import { Outlet, RootRoute } from '@tanstack/react-router'
import { SignIn } from './sign-in'
import { useAuthStore } from '~/stores/auth'

export const rootRoute = new RootRoute({
  component: function Root() {
    const { userId } = useAuthStore()

    if (!userId)
      return <SignIn />

    return <>
      <Outlet />
    </>
  },
})
