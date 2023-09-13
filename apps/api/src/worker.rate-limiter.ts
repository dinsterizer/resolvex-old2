import { initRateLimiter } from '@resolvex/worker-rate-limiter/src'

const { DO: RateLimiterDO, createRateLimiter } = initRateLimiter()

export { RateLimiterDO, createRateLimiter }
