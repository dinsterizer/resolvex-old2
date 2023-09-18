/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { createContext } from './worker.context'
import { handleCorsRequest, handleCorsResponse } from './worker.cors'
import { envSchema } from './worker.env'
import { handleTrpcRequest } from './worker.trpc'

export default {
  async fetch(request: Request, unvalidatedEnv: unknown, ec: ExecutionContext) {
    const env = envSchema.parse(unvalidatedEnv)
    const context = createContext({ env, ec })

    if (env.WORKER_ENV === 'development') await new Promise((resolve) => setTimeout(resolve, 600))

    let response: Response | undefined

    response ??= await handleCorsRequest({ request, context })

    response ??= await handleTrpcRequest({ request, context })

    response ??= new Response('Not found', {
      status: 404,
    })

    response = await handleCorsResponse({ response, context })

    return response
  },
}

export { RateLimiterDO } from './worker.rate-limiter'
