import { create } from 'zustand'

export const useAuthStore = create<{
  userId: string | null
}>(() => ({
  userId: null,
}))
