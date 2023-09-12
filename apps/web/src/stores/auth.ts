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

// TODO - handle expire token

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
  }),
)
