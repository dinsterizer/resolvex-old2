import { decodeJwt } from 'jose'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Authed {
  user: {
    id: string
    name: string
    email: string
  }
  jwt: string
}

interface Unauthed {
  user: null
  jwt: null
}

export const useAuthStore = create(
  persist<
    (Authed | Unauthed) & {
      login: (auth: Authed) => void
      logout: () => void
    }
  >(
    (set) => ({
      user: null,
      jwt: null,
      login(auth) {
        set(() => auth)
      },
      logout() {
        set(() => ({ user: null, jwt: null }))
      },
    }),
    {
      name: 'auth-store',
      onRehydrateStorage: () => {
        return (state) => {
          if (!state || !state.jwt) return
          try {
            const claims = decodeJwt(state.jwt)

            if (claims.exp! - 2 * 60 * 60 < Math.floor(Date.now() / 1000)) state.logout()
          } catch (e) {
            state.logout()
          }
        }
      },
    },
  ),
)

export function useAuthedStore() {
  const auth = useAuthStore()
  if (!auth.user) throw new Error('Requires the user to be logged in')

  return auth
}
