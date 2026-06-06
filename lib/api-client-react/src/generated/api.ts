import type {
  HealthStatus,
  BlogPost,
  NewsletterInput,
  ContactInput,
  SuccessResponse,
  Wallpaper,
  Template,
  Guide,
} from "./api.schemas";

import { customFetch } from "../custom-fetch";
import type { ErrorType } from "../custom-fetch";
import { useFetch, useCustomMutation } from "../use-fetch";

type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

export const getHealthCheckUrl = () => `/api/healthz`;

export const healthCheck = async (options?: RequestInit): Promise<HealthStatus> => {
  return customFetch<HealthStatus>(getHealthCheckUrl(), { ...options, method: "GET" });
};

export const getHealthCheckQueryKey = () => [`/api/healthz`] as const;

export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;

export function useHealthCheck() {
  return useFetch(getHealthCheckQueryKey().join("/"), () => healthCheck());
}

export const getGetGuideUrl = (slug: string) => `/api/guides/${slug}`;

export const getGuide = async (slug: string, options?: RequestInit): Promise<Guide> => {
  return customFetch<Guide>(getGetGuideUrl(slug), { ...options, method: "GET" });
};

export const getGetGuideQueryKey = (slug: string) => [`/api/guides/${slug}`] as const;

export type GetGuideQueryResult = NonNullable<Awaited<ReturnType<typeof getGuide>>>;
export type GetGuideQueryError = ErrorType<unknown>;

export function useGetGuide(slug: string) {
  return useFetch(getGetGuideQueryKey(slug).join("/"), () => getGuide(slug), { enabled: !!slug });
}

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export const getListBlogPostsUrl = () => `/api/blog-posts`;

export const listBlogPosts = async (options?: RequestInit): Promise<BlogPost[]> => {
  return customFetch<BlogPost[]>(getListBlogPostsUrl(), { ...options, method: "GET" });
};

export const getListBlogPostsQueryKey = () => [`/api/blog-posts`] as const;

export type ListBlogPostsQueryResult = NonNullable<Awaited<ReturnType<typeof listBlogPosts>>>;
export type ListBlogPostsQueryError = ErrorType<unknown>;

export function useListBlogPosts() {
  return useFetch(getListBlogPostsQueryKey().join("/"), () => listBlogPosts());
}

export const getGetBlogPostUrl = (slug: string) => `/api/blog-posts/${slug}`;

export const getBlogPost = async (slug: string, options?: RequestInit): Promise<BlogPost> => {
  return customFetch<BlogPost>(getGetBlogPostUrl(slug), { ...options, method: "GET" });
};

export const getGetBlogPostQueryKey = (slug: string) => [`/api/blog-posts/${slug}`] as const;

export type GetBlogPostQueryResult = NonNullable<Awaited<ReturnType<typeof getBlogPost>>>;
export type GetBlogPostQueryError = ErrorType<unknown>;

export function useGetBlogPost(slug: string) {
  return useFetch(getGetBlogPostQueryKey(slug).join("/"), () => getBlogPost(slug), { enabled: !!slug });
}

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------

export const getSubscribeNewsletterUrl = () => `/api/newsletter`;

export const subscribeNewsletter = async (
  newsletterInput: NewsletterInput,
  options?: RequestInit,
): Promise<SuccessResponse> => {
  return customFetch<SuccessResponse>(getSubscribeNewsletterUrl(), {
    ...options,
    method: "POST",
    body: JSON.stringify(newsletterInput),
  });
};

export type SubscribeNewsletterMutationResult = NonNullable<Awaited<ReturnType<typeof subscribeNewsletter>>>;
export type SubscribeNewsletterMutationError = ErrorType<unknown>;

export function useSubscribeNewsletter() {
  return useCustomMutation<{ data: NewsletterInput }, SuccessResponse>(
    (variables) => subscribeNewsletter(variables.data),
  );
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export const getSubmitContactUrl = () => `/api/contact`;

export const submitContact = async (
  contactInput: ContactInput,
  options?: RequestInit,
): Promise<SuccessResponse> => {
  return customFetch<SuccessResponse>(getSubmitContactUrl(), {
    ...options,
    method: "POST",
    body: JSON.stringify(contactInput),
  });
};

export type SubmitContactMutationResult = NonNullable<Awaited<ReturnType<typeof submitContact>>>;
export type SubmitContactMutationError = ErrorType<unknown>;

export function useSubmitContact() {
  return useCustomMutation<{ data: ContactInput }, SuccessResponse>(
    (variables) => submitContact(variables.data),
  );
}

// ---------------------------------------------------------------------------
// Wallpapers
// ---------------------------------------------------------------------------

export const getListWallpapersUrl = () => `/api/wallpapers`;

export const listWallpapers = async (options?: RequestInit): Promise<Wallpaper[]> => {
  return customFetch<Wallpaper[]>(getListWallpapersUrl(), { ...options, method: "GET" });
};

export const getListWallpapersQueryKey = () => [`/api/wallpapers`] as const;

export type ListWallpapersQueryResult = NonNullable<Awaited<ReturnType<typeof listWallpapers>>>;
export type ListWallpapersQueryError = ErrorType<unknown>;

export function useListWallpapers() {
  return useFetch(getListWallpapersQueryKey().join("/"), () => listWallpapers());
}

export const getGetWallpaperUrl = (slug: string) => `/api/wallpapers/${slug}`;

export const getWallpaper = async (slug: string, options?: RequestInit): Promise<Wallpaper> => {
  return customFetch<Wallpaper>(getGetWallpaperUrl(slug), { ...options, method: "GET" });
};

export const getGetWallpaperQueryKey = (slug: string) => [`/api/wallpapers/${slug}`] as const;

export type GetWallpaperQueryResult = NonNullable<Awaited<ReturnType<typeof getWallpaper>>>;
export type GetWallpaperQueryError = ErrorType<unknown>;

export function useGetWallpaper(slug: string) {
  return useFetch(getGetWallpaperQueryKey(slug).join("/"), () => getWallpaper(slug), { enabled: !!slug });
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export const getListTemplatesUrl = () => `/api/templates`;

export const listTemplates = async (options?: RequestInit): Promise<Template[]> => {
  return customFetch<Template[]>(getListTemplatesUrl(), { ...options, method: "GET" });
};

export const getListTemplatesQueryKey = () => [`/api/templates`] as const;

export type ListTemplatesQueryResult = NonNullable<Awaited<ReturnType<typeof listTemplates>>>;
export type ListTemplatesQueryError = ErrorType<unknown>;

export function useListTemplates() {
  return useFetch(getListTemplatesQueryKey().join("/"), () => listTemplates());
}

export const getGetTemplateUrl = (slug: string) => `/api/templates/${slug}`;

export const getTemplate = async (slug: string, options?: RequestInit): Promise<Template> => {
  return customFetch<Template>(getGetTemplateUrl(slug), { ...options, method: "GET" });
};

export const getGetTemplateQueryKey = (slug: string) => [`/api/templates/${slug}`] as const;

export type GetTemplateQueryResult = NonNullable<Awaited<ReturnType<typeof getTemplate>>>;
export type GetTemplateQueryError = ErrorType<unknown>;

export function useGetTemplate(slug: string) {
  return useFetch(getGetTemplateQueryKey(slug).join("/"), () => getTemplate(slug), { enabled: !!slug });
}

// ---------------------------------------------------------------------------
// Guides
// ---------------------------------------------------------------------------

export const getListGuidesUrl = () => `/api/guides`;

export const listGuides = async (options?: RequestInit): Promise<Guide[]> => {
  return customFetch<Guide[]>(getListGuidesUrl(), { ...options, method: "GET" });
};

export const getListGuidesQueryKey = () => [`/api/guides`] as const;

export type ListGuidesQueryResult = NonNullable<Awaited<ReturnType<typeof listGuides>>>;
export type ListGuidesQueryError = ErrorType<unknown>;

export function useListGuides() {
  return useFetch(getListGuidesQueryKey().join("/"), () => listGuides());
}
