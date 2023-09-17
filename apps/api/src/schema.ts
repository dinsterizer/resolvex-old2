import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { index, primaryKey, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'
import { datetime, emailCol, json } from './schema.extend'
import { generateCustomerId, generateTimelineId, generateUserId, generateWorkspaceId } from './utils'

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
  assignedCustomers: many(Customers),
  createdTimelines: many(Timelines),
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
  customers: many(Customers),
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

export const Customers = sqliteTable(
  'customers',
  {
    id: text('id')
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateCustomerId()),
    workspaceId: text('workspace_id').notNull(),
    name: text('name').notNull(),
    email: emailCol('email'),
    status: text('status', {
      enum: ['waiting', 'helping', 'helped', 'spam'],
    }).notNull(),
    assignedUserId: text('assigned_user_id'),
    updatedAt: datetime('updated_at')
      .notNull()
      .$defaultFn(() => new Date()),
    createdAt: datetime('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    email_unique: unique('customers_email_unique').on(t.workspaceId, t.email),
    primary_index: index('customers_primary_index').on(t.workspaceId, t.status, t.createdAt),
    assigned_user_index: index('customers_assigned_user_index').on(t.assignedUserId),
  }),
)

export const CustomerRelations = relations(Customers, ({ one, many }) => ({
  workspace: one(Workspaces, {
    fields: [Customers.workspaceId],
    references: [Workspaces.id],
  }),
  assignedUser: one(Users, {
    fields: [Customers.assignedUserId],
    references: [Users.id],
  }),
  createdTimelines: many(Timelines, {
    relationName: 'customerCreator',
  }),
  timelines: many(Timelines, {
    relationName: 'customer',
  }),
}))

export type SelectCustomer = InferSelectModel<typeof Customers>
export type InsertCustomer = InferInsertModel<typeof Customers>

export const Timelines = sqliteTable(
  'timelines',
  {
    id: text('id')
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateTimelineId()),
    customerId: text('customer_id').notNull(),
    creatorId: text('creator_id'), // can be user_id or customer_id or null for system bot
    data: json(
      z.object({
        type: z.literal('chat'),
        message: z.string(),
      }),
      'data',
    ).notNull(),
    createdAt: datetime('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    primary_index: index('timelines_primary_index').on(t.customerId, t.createdAt),
    secondary_index: index('timelines_secondary_index').on(t.creatorId, t.createdAt),
  }),
)

export const timelinesRelations = relations(Timelines, ({ one }) => ({
  customer: one(Customers, {
    relationName: 'customer',
    fields: [Timelines.customerId],
    references: [Customers.id],
  }),
  customerCreator: one(Customers, {
    relationName: 'customerCreator',
    fields: [Timelines.creatorId],
    references: [Customers.id],
  }),
  userCreator: one(Users, {
    fields: [Timelines.creatorId],
    references: [Users.id],
  }),
}))

export type SelectTimeline = InferSelectModel<typeof Timelines>
export type InsertTimeline = InferInsertModel<typeof Timelines>
