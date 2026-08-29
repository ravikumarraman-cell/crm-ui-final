import { existsSync, readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const failures = [];
const read = (name) => readFileSync(new URL(name, root), 'utf8');
const requireFile = (name) => {
  if (!existsSync(new URL(name, root))) failures.push(`Missing required production file: ${name}`);
};
const requireValue = (condition, message) => {
  if (!condition) failures.push(message);
};

function readJson(name) {
  try {
    return JSON.parse(read(name));
  } catch {
    failures.push(`Invalid JSON: ${name}`);
    return {};
  }
}

const rootVercel = readJson('vercel.json');
const webVercel = readJson('apps/web/vercel.json');

for (const [name, config] of [['vercel.json', rootVercel], ['apps/web/vercel.json', webVercel]]) {
  requireValue(config.framework === 'vite', `${name} must declare the Vite framework.`);
  requireValue(config.outputDirectory === 'dist', `${name} must publish the Vite dist directory.`);
  requireValue(typeof config.installCommand === 'string' && config.installCommand.includes('npm ci --include=dev --include=optional'), `${name} must install reproducible build-time and optional dependencies.`);
  requireValue(typeof config.buildCommand === 'string' && config.buildCommand.includes('verify:production'), `${name} must run the production preflight before building.`);
  requireValue(Array.isArray(config.crons) && config.crons.some((cron) => cron.path === '/api/cron/notifications'), `${name} must retain the notification cron route.`);
  requireValue(Array.isArray(config.rewrites) && config.rewrites.some((rewrite) => rewrite.destination === '/index.html'), `${name} must preserve SPA deep-link routing.`);
  const headers = Array.isArray(config.headers) ? config.headers : [];
  const workerHeaders = headers.find((rule) => rule.source === '/service-worker.js')?.headers;
  requireValue(Array.isArray(workerHeaders) && workerHeaders.some((header) => header.key === 'Cache-Control' && header.value === 'no-cache, no-store, must-revalidate'), `${name} must prevent HTTP caching of the service worker.`);
  const iconHeaders = headers.find((rule) => rule.source === '/icons/:path*')?.headers;
  requireValue(Array.isArray(iconHeaders) && iconHeaders.some((header) => header.key === 'Cache-Control' && header.value === 'public, max-age=86400'), `${name} must publish PWA icons with the public app assets.`);
}

const rootPwaHeaders = (rootVercel.headers ?? []).filter((rule) => rule.source === '/service-worker.js' || rule.source === '/icons/:path*');
const webPwaHeaders = (webVercel.headers ?? []).filter((rule) => rule.source === '/service-worker.js' || rule.source === '/icons/:path*');
requireValue(JSON.stringify(rootPwaHeaders) === JSON.stringify(webPwaHeaders), 'Root and web Vercel configurations must keep identical PWA header rules.');

for (const file of [
  'package-lock.json',
  '.npmrc',
]) requireFile(file);

const ignore = read('.gitignore');
for (const pattern of ['node_modules/', '.env.local', '.env.*.local']) {
  requireValue(ignore.includes(pattern), `.gitignore must protect ${pattern}`);
}
requireValue(/^registry=https:\/\/registry\.npmjs\.org\/?$/m.test(read('.npmrc')), '.npmrc must use the public npm registry.');

if (failures.length) {
  console.error(`Production configuration verification failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Production configuration verification passed.');
