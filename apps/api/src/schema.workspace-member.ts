import { z } from 'zod'

export const workspaceMemberRoleColumnAllowValues = ['admin', 'basic_member'] as const
export const workspaceMemberRoleColumnBaseSchema = z.enum(workspaceMemberRoleColumnAllowValues)

export type WorkspaceMemberRoleBaseColumn = z.infer<typeof workspaceMemberRoleColumnBaseSchema>
