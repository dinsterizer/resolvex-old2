import { object, parse, string, url } from 'valibot'

export const env = parse(
  object({
    API_URL: string([url()]),
    DOCS_URL: string([url()]),
    GOOGLE_OAUTH_CLIENT_ID: string(),
  }),
  {
    API_URL: import.meta.env.VITE_API_URL,
    DOCS_URL: import.meta.env.VITE_DOCS_URL,
    GOOGLE_OAUTH_CLIENT_ID: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
  },
)
