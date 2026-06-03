export interface HealthStatus {
  status: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  createdAt: string;
}

export interface NewsletterInput {
  email: string;
}

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SuccessResponse {
  message: string;
}

export interface Wallpaper {
  id: number;
  title: string;
  slug: string;
  category: string;
  imageUrl: string;
  downloadUrl: string;
  price?: number | null;
  createdAt: string;
}

export interface Template {
  id: number;
  title: string;
  slug: string;
  category: string;
  imageUrl: string;
  downloadUrl: string;
  price?: number | null;
  createdAt: string;
}

export interface Guide {
  id: number;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  content: string;
  createdAt: string;
}
