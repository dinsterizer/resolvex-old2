import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { decodeJwt } from 'jose'

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

export const useAuthStore = create(persist<(Authed | Unauthed) & {
  login: (auth: Authed) => void
  logout: () => void
}>(set => ({
    user: null,
    jwt: null,
    login(auth) {
      set(() => auth)
    },
    logout() {
      set(() => ({ user: null, jwt: null }))
    },
  }), {
    name: 'auth-store',
    onRehydrateStorage: () => {
      return (state) => {
        if (!state || !state.jwt)
          return
        try {
          const claims = decodeJwt(state.jwt)

          if (claims.exp! - 2 * 60 * 60 < Date.now() / 1000)
            state.logout()
        }
        catch (e) {
          state.logout()
        }
      }
    },
  }),
)
