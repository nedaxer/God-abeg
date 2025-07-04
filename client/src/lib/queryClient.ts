import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options?: {
    method?: string;
    data?: unknown;
  }
): Promise<Response> {
  try {
    const method = options?.method || 'GET';
    const requestData = options?.data;
    
    const res = await fetch(url, {
      method,
      headers: requestData ? { "Content-Type": "application/json" } : {},
      body: requestData ? JSON.stringify(requestData) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error: any) {
    // Handle offline scenarios gracefully
    if (!navigator.onLine || error?.message?.includes('Failed to fetch')) {
      console.log('[QueryClient] Request failed - offline mode');
      throw new Error('OFFLINE: Request failed due to network connectivity');
    }
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error: any) {
      // Handle offline scenarios gracefully
      if (!navigator.onLine || error?.message?.includes('Failed to fetch')) {
        console.log('[QueryClient] Query failed - offline mode:', queryKey[0]);
        throw new Error('OFFLINE: Query failed due to network connectivity');
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: (failureCount, error) => {
        // Don't retry on offline errors
        if (error?.message?.includes('OFFLINE') || !navigator.onLine) {
          return false;
        }
        // Retry other errors up to 2 times
        return failureCount < 2;
      },
      // Use cached data when queries fail offline
      placeholderData: (previousData: any) => previousData,
      // Keep cached data fresh for longer when offline
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry mutations when offline
        if (error?.message?.includes('OFFLINE') || !navigator.onLine) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});
