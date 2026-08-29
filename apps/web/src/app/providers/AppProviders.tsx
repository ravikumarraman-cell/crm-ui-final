import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { appServices } from '../runtime/appServices';
import { router } from '../router';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useEffect, useState } from 'react';
import { initializePersistence } from '../runtime/appServices';

export function AppProviders() {
  const [ready, setReady] = useState(false);
  const [startupError, setStartupError] = useState<Error | null>(null);

  useEffect(() => {
    void initializePersistence().then(() => setReady(true)).catch((error) => setStartupError(error instanceof Error ? error : new Error(String(error))));
  }, []);

  if (startupError) return <main className="p-8 text-center text-red-600" role="alert">
    <h1>Workspace Unavailable</h1>
    <p>{startupError.message}</p>
  </main>;

  if (!ready) return <main className="flex items-center justify-center h-screen bg-slate-900 text-slate-100" aria-busy="true" aria-label="Loading CRM Contacts">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-sm text-slate-400 font-medium">Loading CRM Contacts…</p>
    </div>
  </main>;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={appServices.queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}


