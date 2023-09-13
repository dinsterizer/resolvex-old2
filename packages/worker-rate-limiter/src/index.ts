import { DO } from './do'
import { RateLimiter } from './rate-limiter'

export function initRateLimiter() {
  return {
    DO,
    createRateLimiter(options: { don: DurableObjectNamespace }) {
      return new RateLimiter({
        durableNamespace: options.don,
      })
    },
  }
}
