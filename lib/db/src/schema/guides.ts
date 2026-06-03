import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const guidesTable = pgTable("guides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGuideSchema = createInsertSchema(guidesTable).omit({ id: true, createdAt: true });
export type InsertGuide = z.infer<typeof insertGuideSchema>;
export type Guide = typeof guidesTable.$inferSelect;
