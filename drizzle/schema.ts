import { pgTable, text, timestamp, varchar, integer, boolean, uuid, jsonb, real } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  authorId: uuid("authorId").references(() => users.id),
  category: varchar("category", { length: 100 }),
  tags: text("tags"), // comma-separated tags
  status: varchar("status", { length: 20 }).default("draft").notNull(), // draft, published, scheduled
  source: varchar("source", { length: 10 }).default("human").notNull(), // human, ai
  viewCount: integer("viewCount").default(0).notNull(),
  publishedAt: timestamp("publishedAt", { mode: "date" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const aiTasks = pgTable("aiTasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  prompt: text("prompt").notNull(),
  modelUsed: varchar("modelUsed", { length: 50 }).default("gpt-4o").notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, processing, completed, failed
  resultArticleId: uuid("resultArticleId").references(() => articles.id),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt", { mode: "date" }),
});

export const wechatArticles = pgTable("wechatArticles", {
  id: uuid("id").primaryKey().defaultRandom(),
  articleId: uuid("articleId")
    .references(() => articles.id)
    .notNull(),
  wechatMediaId: varchar("wechatMediaId", { length: 255 }),
  wechatUrl: varchar("wechatUrl", { length: 500 }),
  publishedAt: timestamp("publishedAt", { mode: "date" }),
  syncStatus: varchar("syncStatus", { length: 20 }).default("pending").notNull(), // pending, synced, failed
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verificationTokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});