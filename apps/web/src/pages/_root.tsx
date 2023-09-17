import { Outlet } from 'react-router-dom'
import { Login } from '~/components/login'
import { useAuthStore } from '~/stores/auth'

export function RootPage() {
  const { user } = useAuthStore()

  if (!user) return <Login />

  return (
    <>
      <Outlet />
    </>
  )
}
