import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from './components/ui/toaster.tsx'
import './globals.css'
import { QueryProvider } from './query-provider.tsx'
import { router } from './router.tsx'

// TODO: ERROR BOUNDARY
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className={import.meta.env.DEV ? 'debug-screens' : ''}>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>

      <Toaster />
    </div>
  </StrictMode>,
)
