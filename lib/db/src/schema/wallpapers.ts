import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const wallpapersTable = pgTable("wallpapers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  images: text("images").array().notNull().default([]),
  features: text("features").array().notNull().default([]),
  whatsIncluded: text("whats_included").array().notNull().default([]),
  downloadUrl: text("download_url").notNull(),
  description: text("description"),
  content: text("content"),
  price: integer("price"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWallpaperSchema = createInsertSchema(wallpapersTable).omit({ id: true, createdAt: true }) as any;
export type InsertWallpaper = z.infer<typeof insertWallpaperSchema>;
export type Wallpaper = typeof wallpapersTable.$inferSelect;
