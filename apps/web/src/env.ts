import { object, parse, string, url } from 'valibot'

export const env = parse(object({
  API_URL: string([url()]),
  DOCS_URL: string([url()]),
}), {
  API_URL: import.meta.env.VITE_API_URL,
  DOCS_URL: import.meta.env.VITE_DOCS_URL,
})
