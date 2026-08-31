import {
  mysqlTable,
  bigint,
  varchar,
  text,
  mysqlEnum,
  decimal,
  int,
  timestamp,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const roleEnum = ["CREDIT_ADMIN", "CREDIT_ANALYST"] as const;
export const submissionTypeEnum = ["MOTORCYCLE", "CAR", "MULTIPURPOSE"] as const;
export const submissionStatusEnum = ["SUBMIT", "APPROVE", "REJECT"] as const;

export const users = mysqlTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  fullname: varchar("fullname", { length: 50 }).notNull(),
  email: varchar("email", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 100 }).notNull(),
  role: mysqlEnum("role", roleEnum).default("CREDIT_ADMIN").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const submissions = mysqlTable("submissions", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  userId: bigint("user_id", { mode: "number" })
    .notNull()
    .references(() => users.id),
  fullname: varchar("fullname", { length: 100 }).notNull(),
  type: mysqlEnum("type", submissionTypeEnum).notNull(),
  amount: decimal("amount", { precision: 16, scale: 2 }).notNull(),
  tenor: int("tenor").notNull(),
  monthlyIncome: decimal("monthly_income", { precision: 16, scale: 2 }).notNull(),
  notes: text("notes"),
  status: mysqlEnum("status", submissionStatusEnum).default("SUBMIT").notNull(),
  approvedBy: bigint("approved_by", { mode: "number" }).references(() => users.id),
  rejectedBy: bigint("rejected_by", { mode: "number" }).references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  submissions: many(submissions, { relationName: "userSubmissions" }),
  approvedSubmissions: many(submissions, { relationName: "approvedSubmissions" }),
  rejectedSubmissions: many(submissions, { relationName: "rejectedSubmissions" }),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  author: one(users, {
    fields: [submissions.userId],
    references: [users.id],
    relationName: "userSubmissions",
  }),
  approver: one(users, {
    fields: [submissions.approvedBy],
    references: [users.id],
    relationName: "approvedSubmissions",
  }),
  rejecter: one(users, {
    fields: [submissions.rejectedBy],
    references: [users.id],
    relationName: "rejectedSubmissions",
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
