import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const contactStatusEnum = pgEnum("contact_status", [
  "new",
  "read",
  "responded",
]);

export const bugSeverityEnum = pgEnum("bug_severity", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const bugStatusEnum = pgEnum("bug_status", [
  "new",
  "investigating",
  "acknowledged",
  "resolved",
  "closed",
]);
