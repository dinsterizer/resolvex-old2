export class DO implements DurableObject {
  constructor(
    private state: DurableObjectState,
    private env: Record<string, unknown>,
  ) {}

  public async fetch(request: Request): Promise<Response> {
    const { limit, duration } = (await request.json()) as { limit: number; duration: number }
    const key = `_DURATION:${duration}_LIMIT:${limit}`

    const value = await this.state.storage.get<string>(key)
    const data: { count: number; unit: number } = value ? JSON.parse(value) : { count: 0, unit: 0 }
    const now = this.convertToUnit(new Date(), duration)

    if (now > data.unit) {
      data.count = 1
      data.unit = now
      await this.state.storage.put(key, JSON.stringify(data))
      return new Response('OK')
    }

    data.count += 1
    await this.state.storage.put(key, JSON.stringify(data))

    return data.count > limit ? new Response('Rate limit exceeded', { status: 429 }) : new Response('OK')
  }

  private convertToUnit(date: Date, duration: number): number {
    return Math.floor(date.getTime() / (duration * 1000))
  }
}
