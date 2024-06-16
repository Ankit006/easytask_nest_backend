import { relations, sql } from 'drizzle-orm';
import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  pgEnum,
  primaryKey,
  date,
  boolean,
} from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
/////////enums

export const priorityEnum = pgEnum('prority', ['low', 'medium', 'high']);
export const statusEnum = pgEnum('status', [
  'active',
  'completed',
  'on hold',
  'pending',
  'canceled',
  'under investigation',
]);
export const roleEnum = pgEnum('role', ['admin', 'moderator', 'member']);

//////////   Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type IUser = InferSelectModel<typeof users>;
export type UserDto = InferSelectModel<typeof users>;

export const usersRelations = relations(users, ({ many }) => ({
  members: many(members),
}));

//////////////////  projects table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export type IProject = InferSelectModel<typeof projects>;
export type ProjectDto = InferInsertModel<typeof projects>;

export const projectsRelations = relations(projects, ({ many }) => ({
  members: many(members),
  sprints: many(sprints),
  groups: many(groups),
  membersToGroups: many(membersToGroups),
}));

/////////////////// member table

export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  projectId: integer('project_id')
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
  role: roleEnum('role'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type IMember = InferSelectModel<typeof members>;
export type MemberDto = InferInsertModel<typeof members>;

export const membersRelations = relations(members, ({ one, many }) => ({
  users: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  projects: one(projects, {
    fields: [members.projectId],
    references: [projects.id],
  }),
  membersToGroups: many(membersToGroups),
  userStoriesToMembers: many(userStoriesToMembers),
  tasksToMembers: many(tasksToMembers),
}));

////////////// member groups

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name'),
  projectId: integer('project_id')
    .references(() => projects.id, { onDelete: 'cascade' })
    .notNull(),
  color: text('color').default(null),
  createdAt: timestamp('created_at').defaultNow(),
});

export type IGroup = InferSelectModel<typeof groups>;
export type GroupDto = InferInsertModel<typeof groups>;

export const groupsRelations = relations(groups, ({ many, one }) => ({
  membersToGroups: many(membersToGroups),
  projects: one(projects, {
    fields: [groups.projectId],
    references: [projects.id],
  }),
}));

///////////// memberToGroup

export const membersToGroups = pgTable(
  'membersToGroups',
  {
    memberId: integer('member_id')
      .notNull()
      .references(() => members.id, { onDelete: 'cascade' }),
    groupId: integer('group_id')
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.memberId, t.groupId, t.projectId] }),
  }),
);

export const memberToGroupsRelations = relations(
  membersToGroups,
  ({ one }) => ({
    member: one(members, {
      fields: [membersToGroups.memberId],
      references: [members.id],
    }),
    group: one(groups, {
      fields: [membersToGroups.groupId],
      references: [groups.id],
    }),
    project: one(projects, {
      fields: [membersToGroups.projectId],
      references: [projects.id],
    }),
  }),
);

// sprints

export const sprints = pgTable('sprints', {
  id: serial('id').primaryKey(),
  startDate: date('start_date'),
  endDate: date('end_date'),
  title: text('title').notNull(),
  description: text('description'),
  isCompleted: boolean('is_completed').notNull().default(false),
  projectId: integer('project_id').references(() => projects.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('created_at').defaultNow(),
});

export type ISprint = InferSelectModel<typeof sprints>;
export type SprintDto = InferInsertModel<typeof sprints>;

export const sprintsRelations = relations(sprints, ({ one, many }) => ({
  project: one(projects, {
    fields: [sprints.projectId],
    references: [projects.id],
  }),
  userStories: many(userStories),
}));

// user story

export const userStories = pgTable('user_stories', {
  id: serial('id').primaryKey(),
  sprintId: integer('sprint_id').references(() => sprints.id),
  projectId: integer('project_id')
    .references(() => projects.id)
    .notNull(),
  title: text('title'),
  description: text('description'),
  priority: priorityEnum('priority').notNull().default('low'),
  status: statusEnum('status').notNull().default('pending'),
  estimateDate: date('estimate_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type IUserStory = InferSelectModel<typeof userStories>;
export type UserStoryDto = InferInsertModel<typeof userStories>;

export const userStoriesRelations = relations(userStories, ({ one, many }) => ({
  spring: one(sprints, {
    fields: [userStories.sprintId],
    references: [sprints.id],
  }),
  project: one(projects, {
    fields: [userStories.projectId],
    references: [projects.id],
  }),
  userStoriesToMembers: many(userStoriesToMembers),
  tasks: many(tasks),
}));

///////// userstoriesToMembers

export const userStoriesToMembers = pgTable(
  'user_stories_to_members',
  {
    memberId: integer('member_id')
      .references(() => members.id)
      .notNull(),
    userStoryId: integer('user_story_id')
      .references(() => userStories.id)
      .notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.memberId, t.userStoryId] }),
  }),
);

export const usertoriesToMembersRelations = relations(
  userStoriesToMembers,
  ({ one }) => ({
    member: one(members, {
      fields: [userStoriesToMembers.memberId],
      references: [members.id],
    }),
    userStory: one(userStories, {
      fields: [userStoriesToMembers.userStoryId],
      references: [userStories.id],
    }),
  }),
);

/////////// tasks

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  task: text('task').notNull(),
  status: statusEnum('status').notNull().default('pending'),
  priority: priorityEnum('priority').notNull().default('low'),
  userStoryId: integer('user_story_id')
    .notNull()
    .references(() => userStories.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  userStory: one(userStories, {
    fields: [tasks.userStoryId],
    references: [userStories.id],
  }),
  tasksToMembers: many(tasksToMembers),
  taskDetails: one(taskDetails, {
    fields: [tasks.id],
    references: [taskDetails.taskId],
  }),
  taskComments: many(taskComments),
}));

///// task details

export const taskDetails = pgTable('task_details', {
  id: serial('id').primaryKey(),
  notes: text('notes'),
  attachments: text('attachments')
    .array()
    .default(sql`'{}'::text[]`),
  taskId: integer('task_id').references(() => tasks.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const taskDetailsRelatons = relations(taskDetails, ({ one }) => ({
  task: one(tasks, {
    fields: [taskDetails.taskId],
    references: [tasks.id],
  }),
}));

/////////// task commnets

export const taskComments = pgTable('task_comments', {
  id: serial('id').primaryKey(),
  comment: text('comment').notNull(),
  taskId: integer('task_id')
    .references(() => tasks.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const taskCommnetsRelations = relations(taskComments, ({ one }) => ({
  task: one(tasks, {
    fields: [taskComments.taskId],
    references: [tasks.id],
  }),
}));

///////// tasks to members

export const tasksToMembers = pgTable(
  'tasks_to_members',
  {
    taskId: integer('task_id')
      .references(() => tasks.id, { onDelete: 'cascade' })
      .notNull(),
    memberId: integer('member_id')
      .references(() => members.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.memberId, t.taskId] }),
  }),
);

export const tasksToMembersRelations = relations(tasksToMembers, ({ one }) => ({
  task: one(tasks, {
    fields: [tasksToMembers.taskId],
    references: [tasks.id],
  }),
  member: one(members, {
    fields: [tasksToMembers.memberId],
    references: [members.id],
  }),
}));
