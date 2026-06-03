import * as zod from "zod";

export const HealthCheckResponse = zod.object({
  status: zod.string(),
});

export const BlogPost = zod.object({
  id: zod.number(),
  title: zod.string(),
  slug: zod.string(),
  excerpt: zod.string(),
  content: zod.string(),
  imageUrl: zod.string(),
  author: zod.string(),
  publishedAt: zod.string(),
  createdAt: zod.string(),
});

export const ListBlogPostsResponse = zod.array(BlogPost);

export const NewsletterInput = zod.object({
  email: zod.string(),
});

export const ContactInput = zod.object({
  name: zod.string(),
  email: zod.string(),
  subject: zod.string(),
  message: zod.string(),
});

export const SuccessResponse = zod.object({
  message: zod.string(),
});

export const Wallpaper = zod.object({
  id: zod.number(),
  title: zod.string(),
  slug: zod.string(),
  category: zod.string(),
  imageUrl: zod.string(),
  downloadUrl: zod.string(),
  price: zod.number().nullable().optional(),
  createdAt: zod.string(),
});

export const ListWallpapersResponse = zod.array(Wallpaper);

export const Template = zod.object({
  id: zod.number(),
  title: zod.string(),
  slug: zod.string(),
  category: zod.string(),
  imageUrl: zod.string(),
  downloadUrl: zod.string(),
  price: zod.number().nullable().optional(),
  createdAt: zod.string(),
});

export const ListTemplatesResponse = zod.array(Template);

export const Guide = zod.object({
  id: zod.number(),
  title: zod.string(),
  slug: zod.string(),
  description: zod.string(),
  imageUrl: zod.string(),
  content: zod.string(),
  createdAt: zod.string(),
});

export const ListGuidesResponse = zod.array(Guide);
