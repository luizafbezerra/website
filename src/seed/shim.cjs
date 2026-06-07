// Preloaded (via `tsx --require`) before the seed entrypoint.
//
// The seed script runs `getPayload({ config })` against a real database. In a
// non-production NODE_ENV the Postgres adapter auto-pushes schema diffs to the
// DB on init — which would silently mutate the schema and bypass the migration
// record. Forcing production mode here disables that push so migrations remain
// the single source of schema truth; `pnpm seed` only ever reads/writes rows.
//
// tsx resolves the tsconfig `paths` aliases (`@/*`, `@payload-config`) natively,
// so no module-resolution shim is required here.
process.env.NODE_ENV = "production";
