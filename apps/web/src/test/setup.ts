import { vi } from 'vitest';

// Set up a basic fetch mock for tests
vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })));
