import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  pgEnum,
  primaryKey,
} from 'drizzle-orm/pg-core';

//////////   Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  members: many(members),
}));

//////////////////  projects table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  members: many(members),
}));

/////////////////// member table

export const roleEnum = pgEnum('role', ['admin', 'moderator', 'member']);

export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  project_id: integer('project_id')
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
  role: roleEnum('role'),
});

export const membersRelations = relations(members, ({ one, many }) => ({
  users: one(users, {
    fields: [members.user_id],
    references: [users.id],
  }),
  projects: one(projects, {
    fields: [members.project_id],
    references: [projects.id],
  }),
  membersToGroups: many(membersToGroups),
}));

////////////// member groups

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const groupsRelations = relations(groups, ({ many }) => ({
  membersToGroups: many(membersToGroups),
}));

///////////// memberToGroup

export const membersToGroups = pgTable(
  'membersToGroups',
  {
    memberId: integer('member_id')
      .notNull()
      .references(() => members.id),
    groupdId: integer('group_id')
      .notNull()
      .references(() => groups.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.memberId, t.groupdId] }),
  }),
);

// user story

export const priorityEnum = pgEnum('prority', ['low', 'medium', 'high']);
export const statusEnum = pgEnum('status', [
  'active',
  'completed',
  'on hold',
  'pending',
  'overdue',
  'canceled',
  'under investigation',
]);
export const userStories = pgTable('user_stories', {
  id: serial('id').primaryKey(),
  projctId: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title'),
  description: text('description'),
  priority: priorityEnum('priority'),
  status: statusEnum('status'),
});
