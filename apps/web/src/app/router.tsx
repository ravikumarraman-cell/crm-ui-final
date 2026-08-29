import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { lazy, Suspense, type ComponentType, type ReactNode } from 'react';
import { appServices } from './runtime/appServices';

const page = <T extends Record<string, ComponentType<any>>>(load: () => Promise<T>, name: keyof T) => lazy(async () => ({ default: (await load())[name] }));
const CrmContactsPage = page(() => import('../pages/CrmContactsPage'), 'CrmContactsPage');
const Lazy = ({ children }: { children: ReactNode }) => <Suspense fallback={<main className="page-surface" aria-busy="true">Loading…</main>}>{children}</Suspense>;

const rootRoute = createRootRouteWithContext<{
  queryClient: typeof appServices.queryClient;
}>()({
  component: RootLayout,
});

function RootLayout() {
  return <Outlet />;
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Lazy><CrmContactsPage /></Lazy>,
});

const contactsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'contacts',
  component: () => <Lazy><CrmContactsPage /></Lazy>,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  contactsRoute,
]);

export const router = createRouter({
  routeTree,
  context: {
    queryClient: appServices.queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 5_000,
});

