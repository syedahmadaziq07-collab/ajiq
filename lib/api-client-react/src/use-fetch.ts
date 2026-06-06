import { useState, useEffect, useCallback } from "react";

export interface FetchState<T> {
  data: T | undefined;
  isLoading: boolean;
  isPending: boolean;
  error: unknown;
}

export function useFetch<T>(
  queryKey: string,
  fetcher: () => Promise<T>,
  options?: { enabled?: boolean },
): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: undefined,
    isLoading: true,
    isPending: true,
    error: null,
  });

  useEffect(() => {
    if (options?.enabled === false) {
      setState({ data: undefined, isLoading: false, isPending: false, error: null });
      return;
    }

    let cancelled = false;
    setState((prev: FetchState<T>) => ({ ...prev, isLoading: true, isPending: true }));

    fetcher()
      .then((data: T) => {
        if (!cancelled) setState({ data, isLoading: false, isPending: false, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ data: undefined, isLoading: false, isPending: false, error });
      });

    return () => {
      cancelled = true;
    };
  }, [queryKey]);

  return state;
}

export function useCustomMutation<TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
) {
  const [state, setState] = useState<{
    isLoading: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isIdle: boolean;
    error: unknown;
    status: "idle" | "loading" | "success" | "error";
  }>({
    isLoading: false,
    isPending: false,
    isSuccess: false,
    isIdle: true,
    error: null,
    status: "idle",
  });

  const mutate = useCallback(async (
    variables: TVariables,
    options?: { onSuccess?: (data: TData) => void; onError?: (error: unknown) => void },
  ): Promise<TData | undefined> => {
    setState({
      isLoading: true,
      isPending: true,
      isSuccess: false,
      isIdle: false,
      error: null,
      status: "loading",
    });
    try {
      const data = await mutationFn(variables);
      setState({
        isLoading: false,
        isPending: false,
        isSuccess: true,
        isIdle: false,
        error: null,
        status: "success",
      });
      options?.onSuccess?.(data);
      return data;
    } catch (error: unknown) {
      setState({
        isLoading: false,
        isPending: false,
        isSuccess: false,
        isIdle: false,
        error,
        status: "error",
      });
      options?.onError?.(error);
      return undefined;
    }
  }, [mutationFn]);

  return { mutate, ...state };
}
