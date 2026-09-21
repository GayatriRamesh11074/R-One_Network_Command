import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const gameResults=sqliteTable("game_results",{id:integer("id").primaryKey({autoIncrement:true}),runKey:text("run_key").unique(),name:text("name").notNull(),company:text("company").notNull().default(''),role:text("role").notNull().default('CPO'),contact:text("contact").notNull(),score:integer("score").notNull(),answers:text("answers").notNull(),createdAt:text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`)});
