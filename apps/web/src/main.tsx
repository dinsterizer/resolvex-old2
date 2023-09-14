import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from './components/ui/toaster.tsx'
import './globals.css'
import { QueryProvider } from './query-provider.tsx'
import { router } from './router.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>

    <Toaster />
  </StrictMode>,
)
