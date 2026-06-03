import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const downloadsTable = pgTable("downloads", {
  id: serial("id").primaryKey(),
  itemType: text("item_type").notNull(),
  itemId: integer("item_id").notNull(),
  count: integer("count").notNull().default(0),
});

export const insertDownloadSchema = createInsertSchema(downloadsTable).omit({ id: true });
export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type Download = typeof downloadsTable.$inferSelect;
