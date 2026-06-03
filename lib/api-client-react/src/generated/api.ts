import { useQuery, useMutation } from "@tanstack/react-query";
import type {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

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

type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

export const getHealthCheckUrl = () => `/api/healthz`;

export const healthCheck = async (options?: RequestInit): Promise<HealthStatus> => {
  return customFetch<HealthStatus>(getHealthCheckUrl(), { ...options, method: "GET" });
};

export const getHealthCheckQueryKey = () => [`/api/healthz`] as const;

export const getHealthCheckQueryOptions = <
  TData = Awaited<ReturnType<typeof healthCheck>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getHealthCheckQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof healthCheck>>> = ({ signal }) =>
    healthCheck({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof healthCheck>>, TError, TData
  > & { queryKey: QueryKey };
};

export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;

export function useHealthCheck<
  TData = Awaited<ReturnType<typeof healthCheck>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getHealthCheckQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

// ---------------------------------------------------------------------------
// Blog Posts
// ---------------------------------------------------------------------------

export const getListBlogPostsUrl = () => `/api/blog-posts`;

export const listBlogPosts = async (options?: RequestInit): Promise<BlogPost[]> => {
  return customFetch<BlogPost[]>(getListBlogPostsUrl(), { ...options, method: "GET" });
};

export const getListBlogPostsQueryKey = () => [`/api/blog-posts`] as const;

export const getListBlogPostsQueryOptions = <
  TData = Awaited<ReturnType<typeof listBlogPosts>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof listBlogPosts>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getListBlogPostsQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof listBlogPosts>>> = ({ signal }) =>
    listBlogPosts({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listBlogPosts>>, TError, TData
  > & { queryKey: QueryKey };
};

export type ListBlogPostsQueryResult = NonNullable<Awaited<ReturnType<typeof listBlogPosts>>>;
export type ListBlogPostsQueryError = ErrorType<unknown>;

export function useListBlogPosts<
  TData = Awaited<ReturnType<typeof listBlogPosts>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof listBlogPosts>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListBlogPostsQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

export const getGetBlogPostUrl = (slug: string) => `/api/blog-posts/${slug}`;

export const getBlogPost = async (slug: string, options?: RequestInit): Promise<BlogPost> => {
  return customFetch<BlogPost>(getGetBlogPostUrl(slug), { ...options, method: "GET" });
};

export const getGetBlogPostQueryKey = (slug: string) => [`/api/blog-posts/${slug}`] as const;

export const getGetBlogPostQueryOptions = <
  TData = Awaited<ReturnType<typeof getBlogPost>>,
  TError = ErrorType<unknown>,
>(slug: string, options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getBlogPost>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetBlogPostQueryKey(slug);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getBlogPost>>> = ({ signal }) =>
    getBlogPost(slug, { signal, ...requestOptions });
  return { queryKey, queryFn, enabled: !!slug, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getBlogPost>>, TError, TData
  > & { queryKey: QueryKey };
};

export type GetBlogPostQueryResult = NonNullable<Awaited<ReturnType<typeof getBlogPost>>>;
export type GetBlogPostQueryError = ErrorType<unknown>;

export function useGetBlogPost<
  TData = Awaited<ReturnType<typeof getBlogPost>>,
  TError = ErrorType<unknown>,
>(slug: string, options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof getBlogPost>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getGetBlogPostQueryOptions(slug, options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
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

export function useSubscribeNewsletter<
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof subscribeNewsletter>>,
    TError,
    { data: NewsletterInput },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof subscribeNewsletter>>,
  TError,
  { data: NewsletterInput },
  TContext
> {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};
  const mutationFn = (variables: { data: NewsletterInput }) =>
    subscribeNewsletter(variables.data, requestOptions);
  return useMutation({ mutationFn, ...mutationOptions });
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

export function useSubmitContact<
  TError = ErrorType<unknown>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof submitContact>>,
    TError,
    { data: ContactInput },
    TContext
  >;
  request?: SecondParameter<typeof customFetch>;
}): UseMutationResult<
  Awaited<ReturnType<typeof submitContact>>,
  TError,
  { data: ContactInput },
  TContext
> {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};
  const mutationFn = (variables: { data: ContactInput }) =>
    submitContact(variables.data, requestOptions);
  return useMutation({ mutationFn, ...mutationOptions });
}

// ---------------------------------------------------------------------------
// Wallpapers
// ---------------------------------------------------------------------------

export const getListWallpapersUrl = () => `/api/wallpapers`;

export const listWallpapers = async (options?: RequestInit): Promise<Wallpaper[]> => {
  return customFetch<Wallpaper[]>(getListWallpapersUrl(), { ...options, method: "GET" });
};

export const getListWallpapersQueryKey = () => [`/api/wallpapers`] as const;

export const getListWallpapersQueryOptions = <
  TData = Awaited<ReturnType<typeof listWallpapers>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof listWallpapers>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getListWallpapersQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof listWallpapers>>> = ({ signal }) =>
    listWallpapers({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listWallpapers>>, TError, TData
  > & { queryKey: QueryKey };
};

export type ListWallpapersQueryResult = NonNullable<Awaited<ReturnType<typeof listWallpapers>>>;
export type ListWallpapersQueryError = ErrorType<unknown>;

export function useListWallpapers<
  TData = Awaited<ReturnType<typeof listWallpapers>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof listWallpapers>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListWallpapersQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export const getListTemplatesUrl = () => `/api/templates`;

export const listTemplates = async (options?: RequestInit): Promise<Template[]> => {
  return customFetch<Template[]>(getListTemplatesUrl(), { ...options, method: "GET" });
};

export const getListTemplatesQueryKey = () => [`/api/templates`] as const;

export const getListTemplatesQueryOptions = <
  TData = Awaited<ReturnType<typeof listTemplates>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof listTemplates>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getListTemplatesQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof listTemplates>>> = ({ signal }) =>
    listTemplates({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listTemplates>>, TError, TData
  > & { queryKey: QueryKey };
};

export type ListTemplatesQueryResult = NonNullable<Awaited<ReturnType<typeof listTemplates>>>;
export type ListTemplatesQueryError = ErrorType<unknown>;

export function useListTemplates<
  TData = Awaited<ReturnType<typeof listTemplates>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof listTemplates>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListTemplatesQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}

// ---------------------------------------------------------------------------
// Guides
// ---------------------------------------------------------------------------

export const getListGuidesUrl = () => `/api/guides`;

export const listGuides = async (options?: RequestInit): Promise<Guide[]> => {
  return customFetch<Guide[]>(getListGuidesUrl(), { ...options, method: "GET" });
};

export const getListGuidesQueryKey = () => [`/api/guides`] as const;

export const getListGuidesQueryOptions = <
  TData = Awaited<ReturnType<typeof listGuides>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof listGuides>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getListGuidesQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof listGuides>>> = ({ signal }) =>
    listGuides({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof listGuides>>, TError, TData
  > & { queryKey: QueryKey };
};

export type ListGuidesQueryResult = NonNullable<Awaited<ReturnType<typeof listGuides>>>;
export type ListGuidesQueryError = ErrorType<unknown>;

export function useListGuides<
  TData = Awaited<ReturnType<typeof listGuides>>,
  TError = ErrorType<unknown>,
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof listGuides>>, TError, TData>;
  request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const queryOptions = getListGuidesQueryOptions(options);
  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };
  return { ...query, queryKey: queryOptions.queryKey };
}
