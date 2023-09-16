import { z } from 'zod'

export const env = z
  .object({
    API_URL: z.string().url(),
    DOCS_URL: z.string().url(),
    GOOGLE_OAUTH_CLIENT_ID: z.string(),
  })
  .parse({
    API_URL: import.meta.env.VITE_API_URL,
    DOCS_URL: import.meta.env.VITE_DOCS_URL,
    GOOGLE_OAUTH_CLIENT_ID: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
  })
