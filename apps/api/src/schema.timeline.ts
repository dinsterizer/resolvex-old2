import { z } from 'zod'

export const timelineDataColumnBaseSchema = z.object({
  type: z.literal('chat'),
  message: z.string(),
})

export type TimelineDataBaseColumn = z.infer<typeof timelineDataColumnBaseSchema>
