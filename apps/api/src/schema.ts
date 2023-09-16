import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'
import { datetime, emailCol, json } from './schema.extend'
import { generateUserId, generateWorkspaceId } from './utils'

export const Users = sqliteTable('users', {
  id: text('id')
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateUserId()),
  name: text('name').notNull(),
  email: emailCol('email').notNull().unique(),
  otp: json(
    z.object({
      code: z.string(),
      expiresAt: z.date(),
    }),
    'otp',
  ),
  createdAt: datetime('created_at')
    .notNull()
    .$defaultFn(() => new Date()),
})

export const UserRelations = relations(Users, ({ many }) => ({
  workspaceMembers: many(WorkspaceMembers),
}))

export type SelectUser = InferSelectModel<typeof Users>
export type InsertUser = InferInsertModel<typeof Users>

export const Workspaces = sqliteTable('workspaces', {
  id: text('id')
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateWorkspaceId()),
  name: text('name').notNull(),
  createdAt: datetime('created_at')
    .notNull()
    .$defaultFn(() => new Date()),
})

export const WorkspaceRelations = relations(Workspaces, ({ many }) => ({
  members: many(WorkspaceMembers),
}))

export type SelectWorkspace = InferSelectModel<typeof Workspaces>
export type InsertWorkspace = InferInsertModel<typeof Workspaces>

export const WorkspaceMembers = sqliteTable(
  'workspace_members',
  {
    workspaceId: text('workspace_id').notNull(),
    userId: text('user_id').notNull(),
    role: text('role', { enum: ['admin', 'basic_member'] })
      .notNull()
      .$defaultFn(() => 'basic_member'),
    createdAt: datetime('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    pk: primaryKey(t.workspaceId, t.userId),
  }),
)

export const WorkspaceMemberRelations = relations(WorkspaceMembers, ({ one }) => ({
  workspace: one(Workspaces, {
    fields: [WorkspaceMembers.workspaceId],
    references: [Workspaces.id],
  }),
  user: one(Users, {
    fields: [WorkspaceMembers.userId],
    references: [Users.id],
  }),
}))

export type SelectWorkspaceMember = InferSelectModel<typeof WorkspaceMembers>
export type InsertWorkspaceMember = InferInsertModel<typeof WorkspaceMembers>
