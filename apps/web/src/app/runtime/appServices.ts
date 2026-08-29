import { QueryClient } from '@tanstack/react-query';

export const appServices = {
  queryClient: new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  }),
};

export function initializePersistence(): Promise<void> {
  return Promise.resolve();
}

export function resetWorkspaceForAuthChange() {}

