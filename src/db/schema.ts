import {
  pgTable, 
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'; 

import { relations } from 'drizzle-orm';

import {createInsertSchema, createSelectSchema} from 'drizzle-zod'

export const users = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', {length: 255}).notNull().unique(),
  username: varchar('username', {length: 50}).notNull().unique(),
  password: varchar('password', {length: 255}).notNull(), 
  firstName: varchar('first_name', {length: 50}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const habits = pgTable('habits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userID: uuid('user_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
  name: varchar('name', {length: 100}).notNull(), 
  description: text('description'),
  frequency: varchar('frequency', {length: 20}).notNull(), 
  targetCount: integer('target_count').default(1),
  isActive: boolean('is_active').default(true).notNull(),
})

export const entries = pgTable('entries', {
  id:uuid('id').primaryKey().defaultRandom(), 
  habitId: uuid('habit_id').references(() => habits.id, {
    onDelete: 'cascade'
  }).notNull(), 
  completionDate: timestamp('completion_date').defaultNow().notNull(),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().notNull().defaultRandom(), 
  name: varchar('name', {length: 50}).notNull().unique(),
  color: varchar('color', {length: 7}).default('#6b7280'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const habitTags = pgTable('habit_tags', {
  id: uuid('id').primaryKey().notNull().defaultRandom(), 
    habitId: uuid('habit_id').references(() => habits.id, {
    onDelete: 'cascade'
  }).notNull(),
    tagId: uuid('tag_id').references(() => tags.id, {
    onDelete: 'cascade'
  }).notNull()
})

// relationships 

export const userRelations = relations(users, ({many}) => ({
  habits: many(habits)
}))

export const habitRelations = relations(habits, ({one, many}) => ({
  user: one(users, {
    fields: [habits.userID], 
    references: [users.id]
  }),
  entries: many(entries), 
  habitTags: many(habitTags)
}))

// Entries belong to one habit
export const entriesRelations = relations(entries, ({ one }) => ({
  habit: one(habits, {
    fields: [entries.habitId],
    references: [habits.id],
  }),
}))

// Tags can be on many habits
export const tagsRelations = relations(tags, ({ many }) => ({
  habitTags: many(habitTags),
}))

// Junction table relations
export const habitTagsRelations = relations(habitTags, ({ one }) => ({
  habit: one(habits, {
    fields: [habitTags.habitId],
    references: [habits.id],
  }),
  tag: one(tags, {
    fields: [habitTags.tagId],
    references: [tags.id],
  }),
}))

export type User = typeof users.$inferSelect;
export type Habit = typeof habits.$inferSelect; 
export type Entries = typeof entries.$inferSelect; 
export type Tag = typeof tags.$inferSelect; 
export type HabitTag = typeof habitTags.$inferSelect; 



export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)