import type { Context } from './worker.context'

export async function handleCorsRequest({ request }: { context: Context; request: Request }) {
  if (request.method === 'OPTIONS')
    return new Response()
}

export async function handleCorsResponse({ response, context }: { response: Response; context: Context }) {
  try {
    response.headers.set('Access-Control-Allow-Origin', context.env.WEB_URL)
    response.headers.set('Access-Control-Allow-Methods', '*')
    response.headers.set('Access-Control-Allow-Headers', '*')
    response.headers.set('Access-Control-Max-Age', '86400')
  }
  catch (e) {}

  return response
}
