interface Options {
  durableNamespace: DurableObjectNamespace
}

export class RateLimiter {
  private durableNamespace: DurableObjectNamespace
  constructor(options: Options) {
    this.durableNamespace = options.durableNamespace
  }

  public async limit({ key, limit, duration = 60 }: { key: string; limit: number; duration?: number }) {
    const durableObjectId = this.durableNamespace.idFromName(key)
    const durableObject = this.durableNamespace.get(durableObjectId)

    const { status } = await durableObject.fetch(
      new Request('https://rate-limiter', {
        method: 'POST',
        body: JSON.stringify({ limit, duration }),
      }),
    )

    if (status !== 200) return { success: false }

    return { success: true }
  }
}
